import { Module, MiddlewaresConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './modules/core/middleware/auth.middleware';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './modules/core/core.module';
import { FilesModule } from './modules/files/files.module';

@Module({
    modules: [
        CoreModule,
        UsersModule,
        FilesModule,
    ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}