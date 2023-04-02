import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);

  // настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS course')
    .setDescription('REST API Documentation')
    .setVersion('1.0.0')
    .addTag('dev_lev')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () =>
    console.log(`Server has been started on port ${PORT}...`),
  );
}
bootstrap();
