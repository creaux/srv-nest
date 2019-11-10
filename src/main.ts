import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(
          { validationErrors: errors },
          'Bad Request',
        );
      },
    }),
  );

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('NEST')
    .setDescription('CMS API Description')
    .setVersion('1.0')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // TODO: from dotenv, should access service from nest
  await app.listen(process.env.PORT || 4000, '0.0.0.0');

  // Hot Module Replacement Webpack
  if ((module as any).hot) {
    // @ts-ignore
    module.hot.accept();
    // @ts-ignore
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
