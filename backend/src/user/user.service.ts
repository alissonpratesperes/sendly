import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ClsService } from 'nestjs-cls';
import { Prisma, User } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
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

    private buildUserListWhere(search?: string): Prisma.UserWhereInput {
        return {
            DeletedAt: null,
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

        if(await this.findByEmail(email)) {
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
                url: `${requireEnvironmentVariable("BASE_URL")}/authentication/reset?passwordResetToken=${generatedPasswordResetToken}`,
            },
        );

        return this.toUserResponse(createdUser);
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

    private async findByEmail(email: string): Promise<User | null> {
        return this.prismaService.client.user.findUnique({
            where: {
                Email: email,
            },
        });
    }

    async readByEmail(email: string, requireNoPasswordReset: boolean): Promise<User> {
        this.clsService.set("isSystemOperation", true);

        const user = await this.prismaService.client.user.findFirst({
            where: {
                Email: email,
                ...(requireNoPasswordReset && {
                    PasswordResetToken: null,
                }),
                DeletedAt: null,

                Company: {
                    DeletedAt: null,
                },
            },
        });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetUserResponseDto>> {
        const where = this.buildUserListWhere(search);
        const [total, users] = await Promise.all([
            this.prismaService.client.user.count({
                where,
            }),
            this.prismaService.client.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    CreatedAt: "desc",
                },
            }),
        ]);

        return new PaginatedResponseDto(
            page,
            limit,
            total,

            users.map((user: User) => this.toUserResponse(user)),
        );
    }

    async update(id: number, companyId?: number, name?: string, email?: string): Promise<GetUserResponseDto> {
        const user = await this.read(id);

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }
        if (email !== undefined && email !== user.email) {
            if (await this.findByEmail(email)) {
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
        const user = await this.read(id);

        await this.prismaService.client.user.update({
            where: {
                Id: user.id,
            },
            data: {
                HashedRefreshToken: hashedRefreshToken,
            },
        });
    }

    async startPasswordReset(id: number, generatedPasswordResetToken: string, hashedPasswordResetToken: string): Promise<void> {
        this.clsService.set("isSystemOperation", true);

        const user = await this.read(id);

        await this.prismaService.client.user.update({
            where: {
                Id: user.id,
            },
            data: {
                HashedRefreshToken: null,
                PasswordResetToken: hashedPasswordResetToken,
            },
        });
        await this.mailService.sendForgotPasswordEmail(
            user.email,
            {
                name: user.name,
                url: `${requireEnvironmentVariable("BASE_URL")}/authentication/reset?passwordResetToken=${generatedPasswordResetToken}`,
            },
        );
    }

    async completePasswordReset(id: number, hashedPassword: string): Promise<void> {
        this.clsService.set("isSystemOperation", true);

        const user = await this.read(id);

        await this.prismaService.client.user.update({
            where: {
                Id: user.id,
            },
            data: {
                Password: hashedPassword,
                HashedRefreshToken: null,
                PasswordResetToken: null,
                IsFirstAccess: false,
            },
        });
    }

    async delete(id: number): Promise<void> {
        const user = await this.read(id);

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
