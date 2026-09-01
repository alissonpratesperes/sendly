import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { GetUserParamDto } from './dtos/getUserParam.dto';
import { ListUserQueryDto } from './dtos/listUserQuery.dto';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { ListUserResponseDto } from './dtos/listUserResponse.dto';
import { CreateUserCommandDto } from './dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from './dtos/updateUserCommand.dto';
import { IsSystemRoot } from '../authentication/decorators/isSystemRoot.decorator';

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @IsSystemRoot()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateUserCommandDto): Promise<GetUserResponseDto> {
        return this.userService.create(command);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() params: GetUserParamDto): Promise<GetUserResponseDto> {
        return this.userService.read(params);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: ListUserQueryDto): Promise<ListUserResponseDto> {
        return this.userService.list(query);
    }

    @Patch(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.OK)
    async update(@Param() params: GetUserParamDto, @Body() command: UpdateUserCommandDto): Promise<GetUserResponseDto> {
        return this.userService.update(params, command);
    }

    @Delete(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: GetUserParamDto): Promise<void> {
        return this.userService.delete(params);
    }
}
