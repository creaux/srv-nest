import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSingleton } from '../config/config.singleton';
import { plugin } from 'mongoose';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';

// Issue with webpack maybe cause imports *
// TODO: Move to async provider
plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' }); // wrong instance

@Module({
  imports: [
    ConfigModule,
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
})
export class MongoModule {}
