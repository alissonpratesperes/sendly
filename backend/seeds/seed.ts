import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

import { MailService } from '../mail/mail.service';
import { requireEnvironmentVariable } from '../src/common/utils/requireEnvironmentVariable.util';

const prismaClient = new PrismaClient();
const mailService = new MailService();

async function main() {
  const serverInformation = {
    port: requireEnvironmentVariable("PORT"),
    url: requireEnvironmentVariable("BASE_URL"),
  }
  const seedCompany = {
    name: requireEnvironmentVariable("SEED_COMPANY_NAME"),
    document: requireEnvironmentVariable("SEED_COMPANY_DOCUMENT"),
    description: requireEnvironmentVariable("SEED_COMPANY_DESCRIPTION"),
  }
  const seedUser = {
    name: requireEnvironmentVariable("SEED_USER_NAME"),
    email: requireEnvironmentVariable("SEED_USER_EMAIL"),
    password: requireEnvironmentVariable("SEED_USER_PASSWORD"),
  }

  const seededCompany = await prismaClient.company.upsert({
    where: {
      Document: seedCompany.document,
    },
    update: {},
    create: {
      Name: seedCompany.name,
      Document: seedCompany.document,
      Description: seedCompany.description,
    },
  });

  await prismaClient.user.upsert({
    where: {
      Email: seedUser.email,
    },
    update: {
      IsSystemRoot: true,
    },
    create: {
      CompanyId: seededCompany.Id,
      Name: seedUser.name,
      Email: seedUser.email,
      Password: await bcrypt.hash(seedUser.password, 12),
      IsFirstAccess: false,
      IsSystemRoot: true,
    },
  });

  await mailService.onModuleInit();
  await mailService.sendSystemRootEmail(seededUser.email, {
    name: seededUser.name,
    password: seedUser.password,
    url: `${ serverInformation.url }:${ serverInformation.port }`
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
