import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { UsersProviders } from './providers/users.providers';
import { AuthController } from './controllers/auth.controllers';
import { UsersController } from './controllers/users.controllers';
import { databaseProviders } from './providers/database.providers';

@Module({
    components: [AuthService, UsersService, ...databaseProviders, ...UsersProviders],
    controllers: [AuthController, UsersController],
    exports: [...databaseProviders],
})
export class CoreModule {}
