import { Module } from '@nestjs/common';
import {
  MONGO_OPTIONS_TOKEN,
  MongoOptionsService,
} from './mongo-options.service';

@Module({
  providers: [
    { provide: MONGO_OPTIONS_TOKEN, useValue: {} },
    MongoOptionsService,
  ],
  exports: [MongoOptionsService, MONGO_OPTIONS_TOKEN],
})
export class MongoOptionsModule {}
