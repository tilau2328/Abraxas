import { Module } from '@nestjs/common';
import { databaseProviders } from '../core/providers/database.providers';
import { UsersProviders } from '../core/providers/users.providers';
import { UsersController } from './controllers/users.controllers';
import { UsersService } from './services/users.service';

@Module({
    components: [UsersService, ...databaseProviders, ...UsersProviders],
    controllers: [UsersController],
})
export class UsersModule {}
