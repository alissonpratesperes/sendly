import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ClsService } from 'nestjs-cls';
import { Prisma, User } from '@prisma/client';
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { UsersRankingResponseDto } from './dtos/usersRankingResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';

@Injectable()
export class UserService {
    constructor(
        private readonly clsService: ClsService,
        private readonly mailService: MailService,
        private readonly tokenService: TokenService,
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private toUserResponse(user: User): GetUserResponseDto {
        return new GetUserResponseDto(
            user.Id,
            user.CompanyId,

            user.Name,
            user.Email,



            user.IsFirstAccess,
            user.IsSystemRoot,

            user.CreatedAt,
            user.UpdatedAt,
        );
    }

    private buildUserListWhere(search?: string, companyId?: number): Prisma.UserWhereInput {
        return {
            DeletedAt: null,

            ...(companyId !== undefined && { CompanyId: companyId, }),

            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                        { Email: { contains: search } },
                    ],
                }
            : {}),

            Company: {
                DeletedAt: null,
            },
        };
    }

    async create(companyId: number, name: string, email: string): Promise<GetUserResponseDto> {
        await this.companyService.read(companyId);

        if(await this.findByEmail(companyId, email)) {
            throw new ConflictException("A user with this e-mail is already registered");
        }

        const createdUser = await this.prismaService.client.user.create({
            data: {
                CompanyId: companyId,
                Name: name,
                Email: email,
                Password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12),
                IsFirstAccess: true,
            },
        });

        const generatedPasswordResetToken = await this.tokenService.generatePasswordResetToken(createdUser.Id, createdUser.Email);
        const hashedPasswordResetToken = await this.tokenService.generatePasswordResetTokenHash(generatedPasswordResetToken);

        await this.prismaService.client.user.update({
            where: {
                Id: createdUser.Id,
            },
            data: {
                PasswordResetToken: hashedPasswordResetToken,
            },
        });

        await this.mailService.sendFirstAccessEmail(
            createdUser.Email,
            {
                name: createdUser.Name,
                url: `${ requireEnvironmentVariable("BASE_FRONTEND_URL") }/authentication/reset?passwordResetToken=${ generatedPasswordResetToken }`,
            },
        );

        return this.toUserResponse(createdUser);
    }

    async rank(): Promise<UsersRankingResponseDto> {
        const companyId = this.clsService.get<number>("companyId");
        const isSystemRoot = this.clsService.get<boolean>("isSystemRoot");

        if (!isSystemRoot && companyId === undefined) {
            throw new ForbiddenException("Company context not found");
        }

        const client = isSystemRoot ? this.prismaService.authClient : this.prismaService.client;

        const [ranking] = await client.$queryRaw<{ active: bigint; inactive: bigint; }[]>`
            SELECT
                COALESCE(SUM(CASE WHEN u.PasswordResetToken IS NULL AND u.IsFirstAccess = 0 THEN 1 ELSE 0 END), 0) AS active,
                COALESCE(SUM(CASE WHEN u.PasswordResetToken IS NOT NULL AND u.IsFirstAccess = 1 THEN 1 ELSE 0 END), 0) AS inactive
            FROM
                User u
            INNER JOIN
                Company c
            ON
                c.Id = u.CompanyId
            WHERE
                u.DeletedAt IS NULL
            AND
                c.DeletedAt IS NULL

                    ${ !isSystemRoot ? Prisma.sql`AND c.Id = ${ companyId }` : Prisma.empty }
        `;

        return new UsersRankingResponseDto(
            Number(ranking.active),
            Number(ranking.inactive),
        );
    }

    async read(id: number): Promise<GetUserResponseDto> {
        const user = await this.prismaService.client.user.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return this.toUserResponse(user);
    }

    async readForAuthentication(id: number): Promise<User> {
        const user = await this.prismaService.authClient.user.findFirst({
            where: {
                Id: id,
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    private async findByEmail(companyId: number, email: string): Promise<User | null> {
        return this.prismaService.client.user.findUnique({
            where: {
                CompanyId_Email: {
                    CompanyId: companyId,
                    Email: email,
                },
            },
        });
    }

    async readByEmail(email: string, requireNoPasswordReset: boolean) {
        const user = await this.prismaService.authClient.user.findFirst({
            where: {
                Email: email,
                ...(requireNoPasswordReset && { PasswordResetToken: null, }),
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
            include: {
                Company: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async list(page: number = 1, limit: number = 15, search?: string, companyId?: number): Promise<PaginatedResponseDto<GetUserResponseDto>> {
        const where = this.buildUserListWhere(search, companyId);
        const users = await this.prismaService.client.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: [
                { CreatedAt: "desc" },
                { Id: "desc" },
            ],
        });
        const total = await this.prismaService.client.user.count({
            where,
        });

        return new PaginatedResponseDto(
            page,
            limit,
            total,

            users.map((user: User) => this.toUserResponse(user)),
        );
    }

    async update(id: number, companyId?: number, name?: string, email?: string): Promise<GetUserResponseDto> {
        const user = await this.read(id);
        const targetCompanyId = companyId ?? user.companyId;

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }
        if (email !== undefined && (email !== user.email || targetCompanyId !== user.companyId)) {
            if (await this.findByEmail(targetCompanyId, email)) {
                throw new ConflictException("A user with this e-mail is already registered");
            }
        }

        const updatedUser = await this.prismaService.client.user.update({
            where: {
                Id: user.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(name !== undefined && { Name: name, }),
                ...(email !== undefined && { Email: email, }),
            },
        });

        return this.toUserResponse(updatedUser);
    }

    async updateUserRefreshToken(id: number, hashedRefreshToken: string | null): Promise<void> {
        await this.prismaService.authClient.user.update({
            where: {
                Id: id,
            },
            data: {
                HashedRefreshToken: hashedRefreshToken,
            },
        });
    }

    async startPasswordReset(id: number, generatedPasswordResetToken: string, hashedPasswordResetToken: string): Promise<void> {
        const user = await this.readForAuthentication(id);

        await this.prismaService.authClient.user.update({
            where: {
                Id: user.Id,
            },
            data: {
                HashedRefreshToken: null,
                PasswordResetToken: hashedPasswordResetToken,
            },
        });
        await this.mailService.sendForgotPasswordEmail(
            user.Email,
            {
                name: user.Name,
                url: `${ requireEnvironmentVariable("BASE_FRONTEND_URL") }/authentication/reset?passwordResetToken=${ generatedPasswordResetToken }`,
            },
        );
    }

    async completePasswordReset(id: number, hashedPassword: string): Promise<void> {
        const user = await this.readForAuthentication(id);

        await this.prismaService.authClient.user.update({
            where: {
                Id: user.Id,
            },
            data: {
                Password: hashedPassword,
                HashedRefreshToken: null,
                PasswordResetToken: null,
                IsFirstAccess: false,
            },
        });
    }

    async delete(currentUserId: number, id: number): Promise<void> {
        const user = await this.read(id);

        if(user.id === currentUserId) {
            throw new ConflictException("You cannot delete yourself");
        }

        await this.prismaService.client.user.update({
            where: {
                Id: user.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
