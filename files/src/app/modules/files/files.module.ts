import { Module, MiddlewaresConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { databaseProviders } from '../core/providers/database.providers';
import { FoldersController } from './controllers/folders.controller';
import { FoldersProviders } from './providers/folders.providers';
import { FilesController } from './controllers/files.controller';
import { FilesProviders } from './providers/files.providers';
import { FoldersService } from './services/folders.service';
import { FilesService } from './services/files.service';

@Module({
    components: [...databaseProviders, ...FilesProviders, ...FoldersProviders, FilesService, FoldersService],
    controllers: [FilesController, FoldersController],
})
export class FilesModule {}