import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { I18nMiddleware } from './i18n.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nService } from './i18n.service';
import { plugin } from 'mongoose';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';
import { ConfigModule, ConfigService } from '../config/config.module';
import { ConfigSingleton } from '../config/config.singleton';

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
