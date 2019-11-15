import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { plugin } from 'mongoose';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CONFIG_ACCESSORS, ConfigAccessors } from '../config/config.accessors';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';

// Issue with webpack maybe cause imports *
// TODO: Move to async provider
plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' }); // wrong instance

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      useFactory: (
        config: ConfigService,
        accessors: typeof ConfigAccessors,
        logger: LoggerService,
      ) => {
        const uri = config.get(accessors.MONGODB_URI);

        logger.log(`${accessors.MONGODB_URI} is: ${uri}`, 'MongoModule');

        return { uri };
      },
      inject: [ConfigService, CONFIG_ACCESSORS, LoggerService],
    }),
  ],
})
export class MongoModule {}
