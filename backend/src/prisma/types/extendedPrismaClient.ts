import { PrismaClient } from '@prisma/client';

export type ExtendedPrismaClient<T extends PrismaClient> = Omit<T, "$use" | "$on" | "$connect" | "$disconnect" | "$extends">;
