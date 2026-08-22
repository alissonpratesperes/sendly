import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

async function main() {
  const rootCompany = await prismaClient.company.upsert({
    where: {
      Document: '45781858000179',
    },
    update: {},
    create: {
      Name: 'Thesle LTDA',
      Document: '45781858000179',
      Description: 'Soluções premium para telemetria',
    },
  });

  const isRootUserPasswordDefined = process.env.ROOT_USER_PASSWORD;

  if (!isRootUserPasswordDefined) {
    throw new Error("'ROOT_USER_PASSWORD' is not defined");
  }

  const rootUserHashedPassword = await bcrypt.hash(isRootUserPasswordDefined, 12);

  await prismaClient.user.upsert({
    where: {
      Email: 'suporte@thesle.com.br',
    },
    update: {
      IsSystemRoot: true,
    },
    create: {
      CompanyId: rootCompany.Id,
      Name: 'Thesle LTDA | Suporte',
      Email: 'suporte@thesle.com.br',
      Password: rootUserHashedPassword,
      IsFirstAccess: false,
      IsSystemRoot: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
