import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { plugin } from 'mongoose';
import { ConfigModule } from '../config/config.module';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { MongoMemoryService } from './mongo-memory/mongo-memory.service';
import { mongooseOptionsFactory } from './mongoose-options.factory';
import { ConfigFacade } from '../config/config.facade';
import { MongoMemoryModule } from './mongo-memory/mongo-memory.module';
// @ts-ignore
import * as mongooseIntl from 'mongoose-intl';

// Issue with webpack maybe cause imports *
// TODO: Move to async provider
plugin(mongooseIntl, { languages: ['en', 'de', 'fr'], defaultLanguage: 'en' }); // wrong instance

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule, LoggerModule, MongoMemoryModule],
      useFactory: mongooseOptionsFactory,
      inject: [ConfigFacade, LoggerService, MongoMemoryService],
    }),
  ],
})
export class MongoModule {}
