import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // binds ValidationPipe to the entire application
  app.useGlobalPipes(new ValidationPipe());
   // 👇 apply transform to all responses
   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
   // 👇 apply PrismaClientExceptionFilter to entire application, requires HttpAdapterHost because it extends BaseExceptionFilter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  const config = new DocumentBuilder()
    .setTitle('NestJS Prisma Workshop')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
