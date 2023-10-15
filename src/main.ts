import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe , ClassSerializerInterceptor} from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // binds ValidationPipe to the entire application
  app.useGlobalPipes(new ValidationPipe());
   // 👇 apply transform to all responses
   app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
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
