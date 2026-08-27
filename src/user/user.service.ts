import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { GetUserParamDto } from './dtos/getUserParam.dto';
import { ListUserQueryDto } from './dtos/listUserQuery.dto';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { ListUserResponseDto } from './dtos/listUserResponse.dto';
import { CreateUserCommandDto } from './dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from './dtos/updateUserCommand.dto';
import { toUserResponseMapper } from './mappers/toUserResponse.mapper';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

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
            include: {
                Company: true
            }
        });

        return toUserResponseMapper(createdUser);
    }

    async read(params: GetUserParamDto): Promise<GetUserResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                Id: params.id,
                DeletedAt: null,
            },
            include: {
                Company: true
            }
        });

        if(!user) {
            throw new NotFoundException("User not found");
        }

        return toUserResponseMapper(user);
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
                include: {
                    Company: true,
                },
            }),
        ]);

        const totalPages = Math.ceil(total / query.limit);
        const hasNextPage = query.page < totalPages;
        const hasPreviousPage = query.page > 1;
        const data = users.map((user) => toUserResponseMapper(user));

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
                Id: user.id
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
            include: {
                Company: true,
            },
        });

        return toUserResponseMapper(updatedUser);
    }

    async delete(params: GetUserParamDto): Promise<void> {
        const user = await this.read(params);

        await this.prismaService.user.update({
            where: {
                Id: user.id
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
