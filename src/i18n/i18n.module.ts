import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { I18nMiddleware } from './i18n.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nService } from './i18n.service';
import { plugin } from 'mongoose';

@Module({
  providers: [I18nService],
})
export class I18nModule {
  configure(i18n: MiddlewareConsumer) {
    i18n
      .apply(I18nMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
