import { ClsService } from 'nestjs-cls';
import { PrismaClient } from '@prisma/client';
import { ForbiddenException, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ExtendedPrismaClient } from './types/extendedPrismaClient';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly clsService: ClsService,
  ) {
    super();
  }

  public client!: ExtendedPrismaClient<this>;

  async onModuleInit() {
    await this.$connect();

    const clsService = this.clsService;

    this.client = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const isSystemOperation = clsService.get<boolean>("isSystemOperation");
            const isSystemRoot = clsService.get<boolean>("isSystemRoot");
            const companyId = clsService.get<number>("companyId");

            if (isSystemOperation) {
              return query(args);
            }
            if (isSystemRoot) {
              return query(args);
            }
            if (companyId === undefined) {
              throw new Error(`[MultiTenant] "companyId" missing in CLS for model "${model}"`);
            }

            const queryArgs = (args ?? {}) as any;

            if (model === "Company") {
              const forbiddenOperations = [ "create", "createMany", "update", "updateMany", "delete", "deleteMany", "upsert", ];

              if (forbiddenOperations.includes(operation)) {
                throw new ForbiddenException("You do not have permission to modify the entity: 'Company'");
              }

              queryArgs.where = {
                ...queryArgs.where,
                Id: companyId,
              }

              return query(queryArgs);
            }
            if (operation === "create") {
              queryArgs.data = {
                ...queryArgs.data,
                CompanyId: companyId,
              }
            }
            if (operation === "createMany") {
              if (Array.isArray(queryArgs.data)) {
                queryArgs.data = queryArgs.data.map(
                  (item: any) => ({
                    ...item,
                    CompanyId: companyId,
                  }),
                );
              }
            }
            if (operation !== "create" && operation !== "createMany") {
              queryArgs.where = {
                ...queryArgs.where,
                CompanyId: companyId,
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
