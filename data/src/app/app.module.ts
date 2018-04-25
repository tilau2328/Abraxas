import { Module, MiddlewaresConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { AuthMiddleware } from './modules/core/middlewares/auth.middleware';
import { CoreModule } from './modules/core/core.module';

@Module({
    modules: [
        CoreModule,
    ]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
      consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}