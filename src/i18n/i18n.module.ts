import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { I18nMiddleware } from './i18n.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nService } from './i18n.service';
import { plugin } from 'mongoose';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';
import { ConfigModule, ConfigService } from '../config/config.module';
import { ConfigSingleton } from '../config/config.singleton';

// Issue with webpack maybe cause imports *
// TODO: Move to async provider
plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' }); // wrong instance

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigSingleton) => {
        return {
          uri: configService.get(configService.Env.MONGODB_URI),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [I18nService],
})
export class I18nModule {
  configure(i18n: MiddlewareConsumer) {
    i18n
      .apply(I18nMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
