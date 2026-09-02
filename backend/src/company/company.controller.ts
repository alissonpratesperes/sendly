import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { CompanyService } from './company.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetCompanyResponseDto } from './dtos/getCompanyResponse.dto';
import { PaginationQueryDto } from '../common/dtos/paginationQuery.dto';
import { CreateCompanyCommandDto } from './dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from './dtos/updateCompanyCommand.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';
import { IsSystemRoot } from '../authentication/decorators/isSystemRoot.decorator';

@Controller("company")
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
    ) {}

    @Post()
    @IsSystemRoot()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        return this.companyService.create(command.name, command.document, command.description ?? null);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() param: IdParamDto): Promise<GetCompanyResponseDto> {
        return this.companyService.read(param.id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<GetCompanyResponseDto>> {
        return this.companyService.list(query.page, query.limit, query.search);
    }

    @Patch(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.OK)
    async update(@Param() param: IdParamDto, @Body() command: UpdateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        return this.companyService.update(param.id, command.name, command.document, command.description);
    }

    @Delete(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() param: IdParamDto): Promise<void> {
        return this.companyService.delete(param.id);
    }
}
