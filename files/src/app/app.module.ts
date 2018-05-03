import { Module, MiddlewaresConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { FilesMiddleware } from './modules/files/middleware/files.middleware';
import { AuthMiddleware } from './modules/core/middleware/auth.middleware';
import { FilesModule } from './modules/files/files.module';
import { CoreModule } from './modules/core/core.module';

@Module({
    modules: [
        CoreModule, 
        FilesModule,
    ]
})
export class ApplicationModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer
        .apply(AuthMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL })
        .apply(FilesMiddleware)
        .with('files', 5)
        .forRoutes({ path: '/files', method: RequestMethod.POST });
    }
}