import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const port = process.env.PORT || 3000;
  const logger = new Logger('Main');

  const config = new DocumentBuilder()
    .setTitle('Collect')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log('==========================');
  logger.log(`Application is running on:`);
  logger.log(` ~~ ${await app.getUrl()}`);
  logger.log(` ~~ http://localhost:${port}`);
  logger.log('==========================');
}
bootstrap();
