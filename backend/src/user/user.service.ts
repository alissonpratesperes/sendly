import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetUserParamDto } from './dtos/getUserParam.dto';
import { ListUserQueryDto } from './dtos/listUserQuery.dto';
import { CompanyService } from 'src/company/company.service';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { ListUserResponseDto } from './dtos/listUserResponse.dto';
import { CreateUserCommandDto } from './dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from './dtos/updateUserCommand.dto';

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

    private buildUserListWhere(query: ListUserQueryDto) {
        return {
            DeletedAt: null,
            ...(query.search
                ? {
                    OR: [
                        { Name: { contains: query.search } },
                        { Email: { contains: query.search } },
                    ],
                }
            : {}),
        };
    }

    async create(command: CreateUserCommandDto): Promise<GetUserResponseDto> {
        await this.companyService.read(command.companyId);

        const emailAlreadyUsed = await this.prismaService.user.findUnique({
            where: {
                Email: command.email,
            },
        });

        if(emailAlreadyUsed) {
            throw new ConflictException("A user with this e-mail is already registered");
        }

        const createdUser = await this.prismaService.user.create({
            data: {
                CompanyId: command.companyId,
                Name: command.name,
                Email: command.email,
                Password: await bcrypt.hash(command.password, 12),
            },
        });

        return this.toUserResponse(createdUser);
    }

    async read(params: GetUserParamDto): Promise<GetUserResponseDto> {
        const user = await this.prismaService.user.findFirst({
            where: {
                Id: params.id,
                DeletedAt: null,
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
            },
        });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return user;
    }

    async list(query: ListUserQueryDto): Promise<ListUserResponseDto> {
        const skip = (query.page - 1) * query.limit;
        const where = this.buildUserListWhere(query);

        const [total, users] = await Promise.all([
            this.prismaService.user.count({
                where,
            }),
            this.prismaService.user.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: {
                    CreatedAt: "desc",
                },
            }),
        ]);

        const totalPages = Math.ceil(total / query.limit);
        const hasNextPage = query.page < totalPages;
        const hasPreviousPage = query.page > 1;
        const data = users.map((user) => this.toUserResponse(user));

        return new ListUserResponseDto(
            query.page,
            query.limit,
            total,

            totalPages,
            hasNextPage,
            hasPreviousPage,

            data,
        );
    }

    async update(params: GetUserParamDto, command: UpdateUserCommandDto): Promise<GetUserResponseDto> {
        const user = await this.read(params);

        if (command.companyId !== undefined) {
            await this.companyService.read(command.companyId);
        }
        if (command.email !== undefined && command.email !== user.email) {
            const emailAlreadyUsed = await this.prismaService.user.findUnique({
                where: {
                    Email: command.email,
                },
            });

            if (emailAlreadyUsed) {
                throw new ConflictException("A user with this e-mail is already registered");
            }
        }

        const updatedUser = await this.prismaService.user.update({
            where: {
                Id: user.id,
            },
            data: {
                ...(command.companyId !== undefined && {
                    CompanyId: command.companyId,
                }),
                ...(command.name !== undefined && {
                    Name: command.name,
                }),
                ...(command.email !== undefined && {
                    Email: command.email,
                }),
                ...(command.password !== undefined && {
                    Password: await bcrypt.hash(command.password, 12),
                }),
            },
        });

        return this.toUserResponse(updatedUser);
    }

    async updateUserRefreshToken(id: number, hashedRefreshToken: string | null): Promise<void> {
        const user = await this.read({ id });

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
        const user = await this.read({ id });

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
        const user = await this.read({ id });

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

    async delete(params: GetUserParamDto): Promise<void> {
        const user = await this.read(params);

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
