import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
// import metadata from './metadata';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const port = process.env.PORT || 3000;
  const clientUrl = process.env.CLIENT_URL;
  const logger = new Logger('Main');
  const cacheManager: Cache = app.get(CACHE_MANAGER);
  await cacheManager.reset();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: clientUrl });
  const config = new DocumentBuilder()
    .setTitle('Collect')
    .setVersion('1.0')
    .build();
  // await SwaggerModule.loadPluginMetadata(metadata);
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
