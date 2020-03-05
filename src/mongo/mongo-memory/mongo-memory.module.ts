import { Module } from '@nestjs/common';
import { MongoMemoryService } from './mongo-memory.service';
import { MONGO_MEMORY_CONFIG, mongoMemoryConfig } from './mongo-memory.config';
import {
  MONGO_MEMORY,
  MongoMemory,
  MongoMemoryServer,
} from './mongo-memory.dependecy';
import { ConfigFacade } from '../../config/config.facade';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MongoMemoryService,
      useFactory: (mongoMemory: MongoMemory, env: ConfigFacade) => {
        if (env.isDevelopment) {
          return new MongoMemoryService(mongoMemory, env);
        }
        return {};
      },
      inject: [MONGO_MEMORY, ConfigFacade],
    },
    {
      provide: MONGO_MEMORY_CONFIG,
      useValue: mongoMemoryConfig,
    },
    {
      provide: MONGO_MEMORY,
      useValue: MongoMemoryServer,
    },
  ],
  exports: [MongoMemoryService],
})
export class MongoMemoryModule {}
