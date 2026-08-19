import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDocumentation = new DocumentBuilder()
    .setTitle('Sendly')
    .setDescription('API Endpoints Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocumentation);

  SwaggerModule.setup('swagger', app, swaggerDocument, {
    swaggerOptions: {
      tagSorter: 'alpha',
      operationSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3333);
}

bootstrap();
