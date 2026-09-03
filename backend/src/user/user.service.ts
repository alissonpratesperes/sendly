import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from 'src/company/company.service';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginatedResponse.dto';

@Injectable()
export class UserService {
    constructor(
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

    private buildUserListWhere(search?: string) {
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

    private async findByEmail(email: string): Promise<User | null> {
        return this.prismaService.user.findUnique({
            where: {
                Email: email,
            },
        });
    }

    async create(companyId: number, name: string, email: string, password: string): Promise<GetUserResponseDto> {
        await this.companyService.read(companyId);

        if(await this.findByEmail(email)) {
            throw new ConflictException("A user with this e-mail is already registered");
        }

        const createdUser = await this.prismaService.user.create({
            data: {
                CompanyId: companyId,
                Name: name,
                Email: email,
                Password: await bcrypt.hash(password, 12),
            },
        });

        return this.toUserResponse(createdUser);
    }

    async read(id: number): Promise<GetUserResponseDto> {
        const user = await this.prismaService.user.findFirst({
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

    async readByEmail(email: string, requireNoPasswordReset: boolean): Promise<User> {
        const user = await this.prismaService.user.findFirst({
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
            this.prismaService.user.count({
                where,
            }),
            this.prismaService.user.findMany({
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

    async update(id: number, companyId?: number, name?: string, email?: string, password?: string): Promise<GetUserResponseDto> {
        const user = await this.read(id);

        if (companyId !== undefined) {
            await this.companyService.read(companyId);
        }
        if (email !== undefined && email !== user.email) {
            if (await this.findByEmail(email)) {
                throw new ConflictException("A user with this e-mail is already registered");
            }
        }

        const updatedUser = await this.prismaService.user.update({
            where: {
                Id: user.id,
            },
            data: {
                ...(companyId !== undefined && { CompanyId: companyId, }),
                ...(name !== undefined && { Name: name, }),
                ...(email !== undefined && { Email: email, }),
                ...(password !== undefined && { Password: await bcrypt.hash(password, 12), }),
            },
        });

        return this.toUserResponse(updatedUser);
    }

    async updateUserRefreshToken(id: number, hashedRefreshToken: string | null): Promise<void> {
        const user = await this.read(id);

        await this.prismaService.user.update({
            where: {
                Id: user.id,
            },
            data: {
                HashedRefreshToken: hashedRefreshToken,
            },
        });
    }

    async startPasswordReset(id: number, hashedPasswordResetToken: string): Promise<void> {
        const user = await this.read(id);

        await this.prismaService.user.update({
            where: {
                Id: user.id,
            },
            data: {
                HashedRefreshToken: null,
                PasswordResetToken: hashedPasswordResetToken,
            },
        });
    }

    async completePasswordReset(id: number, hashedPassword: string): Promise<void> {
        const user = await this.read(id);

        await this.prismaService.user.update({
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

        await this.prismaService.user.update({
            where: {
                Id: user.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
