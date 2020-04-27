import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { plugin } from 'mongoose';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';
import { MongoOptionsService } from './mongo-options.service';
import { MongoOptionsModule } from './mongo-options.module';

// Issue with webpack maybe cause imports *
// TODO: Move to async provider
plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' }); // wrong instance

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [MongoOptionsModule],
      useClass: MongoOptionsService,
    }),
    MongoOptionsModule,
  ],
})
export class MongoModule {}
