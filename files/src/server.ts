import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(cors());
  app.use(bodyParser.json());
  app.listen(5000, () => console.log('Application is listening on port 5000.'));
}
bootstrap();