import { Module } from '@nestjs/common';
import { databaseProviders } from '../core/providers/database.providers';
import { FoldersController } from './controllers/folders.controller';
import { FilesController } from './controllers/files.controller';
import { FoldersProviders } from './providers/folders.providers';
import { FilesConnector } from './connectors/files.connector';
import { FilesProviders } from './providers/files.providers';
import { FoldersService } from './services/folders.service';
import { FilesService } from './services/files.service';
import { FilesGateway } from './gateways/files.gateway';
import { CoreModule } from '../core/core.module';

@Module({
    components: [FilesConnector, FilesService, FoldersService, FilesGateway, ...databaseProviders, ...FilesProviders, ...FoldersProviders],
    controllers: [FilesController, FoldersController],
    modules: [CoreModule]
})
export class FilesModule {}
