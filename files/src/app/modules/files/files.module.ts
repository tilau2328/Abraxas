import { Module, MiddlewaresConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { databaseProviders } from '../core/providers/database.providers';
import { FilesController } from './controllers/files.controller';
import { FilesProviders } from './providers/files.providers';
import { FilesService } from './services/files.service';

@Module({
    components: [...databaseProviders, ...FilesProviders, FilesService],
    controllers: [FilesController],
})
export class FilesModule {}