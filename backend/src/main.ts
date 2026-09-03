import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AuthenticationStrategy } from './authentication/enums/authenticationStrategy.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, }));
  app.enableCors();

  SwaggerModule.setup(
    "swagger",
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Sendly")
        .setDescription("API Endpoints Documentation")
        .setVersion("1.0")
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', }, AuthenticationStrategy.ACCESS_TOKEN)
        .build(),
    ), {
      swaggerOptions: {
        tagsSorter: "alpha",
        operationsSorter: "alpha",
      }
    }
  );

  await app.listen(Number(process.env.PORT) || 3333);

  const url = (await app.getUrl()).replace("[::1]", "localhost");

  console.log(`🚀 Application :: ${url}`);
  console.log(`📚 Swagger :: ${url}/swagger`);
}

bootstrap();
