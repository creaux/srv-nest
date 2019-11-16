import { Module } from '@nestjs/common';
import { MongoMemoryService } from './mongo-memory.service';
import { MONGO_MEMORY_CONFIG, mongoMemoryConfig } from './mongo-memory.config';
import { LibraryModule } from '../../library/library.module';

@Module({
  imports: [LibraryModule],
  providers: [
    MongoMemoryService,
    {
      provide: MONGO_MEMORY_CONFIG,
      useValue: mongoMemoryConfig,
    },
  ],
  exports: [MongoMemoryService],
})
export class MongoMemoryModule {}
