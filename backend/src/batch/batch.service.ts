import { Batch, Prisma } from '@prisma/client';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { BatchStatus } from './enums/batchStatus.enum';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyService } from '../company/company.service';
import { GetBatchResponseDto } from './dtos/getBatchResponse.dto';
import { PaginatedResponseDto } from '../common/dtos/paginatedResponse.dto';

@Injectable()
export class BatchService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly companyService: CompanyService,
    ) {}

    private toBatchResponse(batch: Batch): GetBatchResponseDto {
        return new GetBatchResponseDto(
            batch.Id,
            batch.CompanyId,

            batch.Name,
            batch.StartedAt,
            batch.EndedAt,

            batch.Status,

            batch.CreatedAt,
            batch.UpdatedAt,
        );
    }

    private buildBatchListWhere(search?: string): Prisma.BatchWhereInput {
        return {
            DeletedAt: null,
            ...(search
                ? {
                    OR: [
                        { Name: { contains: search } },
                    ],
                }
            : {}),
        };
    }

    async create(companyId: number, name: string): Promise<GetBatchResponseDto> {
        await this.companyService.read(companyId);

        const createdBatch = await this.prismaService.batch.create({
            data: {
                CompanyId: companyId,
                Name: name,
            },
        });

        return this.toBatchResponse(createdBatch);
    }

    async read(id: number): Promise<GetBatchResponseDto> {
        const batch = await this.prismaService.batch.findFirst({
            where: {
                Id: id,
                DeletedAt: null,
            },
        });

        if(!batch) {
            throw new NotFoundException("Batch not found");
        }

        return this.toBatchResponse(batch);
    }

    async list(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponseDto<GetBatchResponseDto>> {
        const where = this.buildBatchListWhere(search);
        const [total, batches] = await Promise.all([
            this.prismaService.batch.count({
                where,
            }),
            this.prismaService.batch.findMany({
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

            batches.map((batch: Batch) => this.toBatchResponse(batch)),
        );
    }

    async update(id: number, name?: string): Promise<GetBatchResponseDto> {
        const batch = await this.read(id);

        if (batch.status !== BatchStatus.PENDING) {
            throw new BadRequestException("Only pending batches can be updated");
        }

        const updatedBatch = await this.prismaService.batch.update({
            where: {
                Id: batch.id,
            },
            data: {
                ...(name !== undefined && { Name: name, }),
            },
        });

        return this.toBatchResponse(updatedBatch);
    }

    async delete(id: number): Promise<void> {
        const batch = await this.read(id);

        if (batch.status !== BatchStatus.PENDING) {
            throw new BadRequestException("Only pending batches can be deleted");
        }

        await this.prismaService.batch.update({
            where: {
                Id: batch.id,
            },
            data: {
                DeletedAt: new Date(),
            },
        });
    }
}
