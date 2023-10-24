import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const port = process.env.PORT || 3000;
  const logger = new Logger('Main');
  app.setGlobalPrefix('api');
  app.useBodyParser('text/plain');
  await app.listen(port);
  logger.log('==========================');
  logger.log(`Application is running on:`);
  logger.log(` ~~ ${await app.getUrl()}`);
  logger.log(` ~~ http://localhost:${port}`);
  logger.log('==========================');
}
bootstrap();
