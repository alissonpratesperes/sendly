import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetUserResponseDto } from './dtos/getUserResponse.dto';
import { CreateUserCommandDto } from './dtos/createUserCommand.dto';
import { UpdateUserCommandDto } from './dtos/updateUserCommand.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { IsSystemRoot } from '../authentication/decorators/isSystemRoot.decorator';

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    @IsSystemRoot()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateUserCommandDto): Promise<GetUserResponseDto> {
        return this.userService.create(command.companyId, command.name, command.email, command.password);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetUserResponseDto> {
        return this.userService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetUserResponseDto>> {
        return this.userService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateUserCommandDto): Promise<GetUserResponseDto> {
        return this.userService.update(param.id, command.companyId, command.name, command.email, command.password);
    }

    @Delete(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.userService.delete(param.id);
    }
}
