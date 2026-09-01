import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocumentation = new DocumentBuilder().setTitle("Sendly").setDescription("API Endpoints Documentation").setVersion("1.0").addBearerAuth().build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocumentation);

  SwaggerModule.setup("swagger", app, swaggerDocument, { swaggerOptions: { tagsSorter: "alpha", operationsSorter: "alpha" } });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  await app.listen(process.env.PORT ?? 3333);

  const url = (await app.getUrl()).replace("[::1]", "localhost");

  console.log(`🚀 Application :: ${url}`);
  console.log(`📚 Swagger :: ${url}/swagger`);
}

bootstrap();
