import { ClsService } from 'nestjs-cls';
import { PrismaClient } from '@prisma/client';
import { ForbiddenException, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { ExtendedPrismaClient } from './types/extendedPrismaClient';
import { prismaForbiddenOperations } from './constants/prismaForbiddenOperations.constant';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly clsService: ClsService,
  ) {
    super();
  }

  public authClient!: PrismaClient;
  public client!: ExtendedPrismaClient<this>;

  async onModuleInit() {
    await this.$connect();

    const clsService = this.clsService;

    this.authClient = this;
    this.client = this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const isSystemRoot = clsService.get<boolean>("isSystemRoot");
            const companyId = clsService.get<number>("companyId");

            if (isSystemRoot) {
              return query(args);
            }
            if (companyId === undefined) {
              throw new Error(`[MultiTenant] "companyId" missing in CLS for model "${ model }"`);
            }

            const queryArgs = (args ?? {}) as any;

            if (model === "Company") {
              if (prismaForbiddenOperations.has(operation)) {
                throw new ForbiddenException("You do not have permission to modify the entity: 'Company'");
              } else {
                queryArgs.where = {
                  ...queryArgs.where,
                  Id: companyId,
                }

                return query(queryArgs);
              }
            }
            if (model === "User") {
              if (prismaForbiddenOperations.has(operation)) {
                throw new ForbiddenException("You do not have permission to modify the entity: 'User'");
              } else {
                queryArgs.where = {
                  ...queryArgs.where,
                  CompanyId: companyId,
                }

                return query(queryArgs);
              }
            }

            if (operation === "create") {
              queryArgs.data = {
                ...queryArgs.data,
                CompanyId: companyId,
              };

              return query(queryArgs);
            }
            if (operation === "createMany") {
              if (Array.isArray(queryArgs.data)) {
                queryArgs.data = queryArgs.data.map((item: any) => ({
                  ...item,
                  CompanyId: companyId,
                }));
              }

              return query(queryArgs);
            }
            if (operation === "upsert") {
              queryArgs.where = {
                ...queryArgs.where,
                CompanyId: companyId,
              };

              queryArgs.create = {
                ...queryArgs.create,
                CompanyId: companyId,
              };

              return query(queryArgs);
            }

            queryArgs.where = {
              ...queryArgs.where,
              CompanyId: companyId,
            };

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
