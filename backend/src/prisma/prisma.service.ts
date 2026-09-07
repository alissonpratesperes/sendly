import { ClsService } from 'nestjs-cls';
import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

import { ExtendedPrismaClient } from './types/extendedPrismaClient';
import { PrismaWhereOperations } from './enums/prismaWhereOperations.enum';
import { PrismaCreateOperations } from './enums/prismaCreateOperations.enum';
import { PrismaUniqueOperations } from './enums/prismaUniqueOperations.enum';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly cls: ClsService,
  ) {
    super();
  }

  public client!: ExtendedPrismaClient<this>;

  async onModuleInit() {
    await this.$connect();

    const clsService = this.cls;
    const basePrisma = this as PrismaClient;

    this.client = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const globalModels = ["Company"];

            if (globalModels.includes(model)) {
              return query(args);
            }

            const companyId = clsService.get<number>("companyId");
            const isSystemOperation = clsService.get<boolean>("isSystemOperation");

            if (!companyId && !isSystemOperation) {
              throw new Error(`[MultiTenant] "companyId" missing in CLS for operation in Model: "${model}"`);
            }
            if (!companyId) {
              return query(args);
            }

            const queryArgs = args as any;
            const tenantField = "CompanyId";

            if (Object.values(PrismaUniqueOperations).includes(operation as PrismaUniqueOperations)) {
              const modelKey = model.charAt(0).toLowerCase() + model.slice(1);
              const targetMethod = operation === PrismaUniqueOperations.FindUnique ? PrismaWhereOperations.FindFirst : PrismaWhereOperations.FindFirstOrThrow;

              return (basePrisma as any)[modelKey][targetMethod]({
                ...queryArgs,
                where: {
                  ...queryArgs.where,
                  [tenantField]: companyId,
                },
              });
            }
            if (Object.values(PrismaWhereOperations).includes(operation as PrismaWhereOperations)) {
              queryArgs.where = {
                ...queryArgs.where,
                [tenantField]: companyId,
              };
            }
            if (operation === PrismaCreateOperations.Create && queryArgs.data) {
              queryArgs.data = {
                ...queryArgs.data,
                [tenantField]: companyId,
              };
            }
            if (operation === PrismaCreateOperations.CreateMany && queryArgs.data) {
              if (Array.isArray(queryArgs.data)) {
                queryArgs.data = queryArgs.data.map((item: any) => ({
                  ...item,
                  [tenantField]: companyId,
                }));
              } else if (queryArgs.data.data && Array.isArray(queryArgs.data.data)) {
                queryArgs.data.data = queryArgs.data.data.map((item: any) => ({
                  ...item,
                  [tenantField]: companyId,
                }));
              }
            }

            return query(queryArgs);
          },
        },
      },
    }) as any;
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
