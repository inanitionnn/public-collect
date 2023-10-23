import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import myError from './utils/errors/errors';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const port = process.env.PORT || 3000;
  const logger = new Logger('Main');

  await app.listen(port);
  logger.log('==========================');
  logger.log(`Application is running on:`);
  logger.log(` ~~ ${await app.getUrl()}`);
  logger.log(` ~~ http://localhost:${port}`);

  logger.log('==========================');
}
bootstrap();
