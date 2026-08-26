import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { CompanyService } from './company.service';
import { GetCompanyParamDto } from './dtos/getCompanyParam.dto';
import { ListCompanyQueryDto } from './dtos/listCompanyQuery.dto';
import { GetCompanyResponseDto } from './dtos/getCompanyResponse.dto';
import { ListCompanyResponseDto } from './dtos/listCompanyResponse.dto';
import { CreateCompanyCommandDto } from './dtos/createCompanyCommand.dto';
import { UpdateCompanyCommandDto } from './dtos/updateCompanyCommand.dto';
import { IsSystemRoot } from '../authentication/decorators/isSystemRoot.decorator';

@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    @IsSystemRoot()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() command: CreateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        return this.companyService.create(command);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    async read(@Param() params: GetCompanyParamDto): Promise<GetCompanyResponseDto> {
        return this.companyService.read(params);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async list(@Query() query: ListCompanyQueryDto): Promise<ListCompanyResponseDto> {
        return this.companyService.list(query);
    }

    @Patch(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.OK)
    async update(@Param() params: GetCompanyParamDto, @Body() command: UpdateCompanyCommandDto): Promise<GetCompanyResponseDto> {
        return this.companyService.update(params, command);
    }

    @Delete(":id")
    @IsSystemRoot()
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param() params: GetCompanyParamDto): Promise<void> {
        return this.companyService.delete(params);
    }
}
