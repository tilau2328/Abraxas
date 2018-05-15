import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/app.module';
import { IoAdapter } from '@nestjs/websockets';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(cors());
  app.use(bodyParser.json());
  app.listen(3000, () => console.log('Application is listening on port 3000.'));
}
bootstrap();