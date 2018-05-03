import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersProviders } from './providers/users.providers';
import { AuthController } from './controllers/auth.controllers';
import { databaseProviders } from './providers/database.providers';

@Module({
    components: [AuthService, ...databaseProviders, ...UsersProviders],
    controllers: [AuthController],
    exports: [...databaseProviders],
})
export class CoreModule {}
