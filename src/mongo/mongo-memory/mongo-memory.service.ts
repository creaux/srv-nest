import { Inject, Injectable } from '@nestjs/common';
import { DataMock } from '@pyxismedia/lib-model';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { MONGO_MEMORY, MongoMemory } from '../../library/library.module';
import { MONGO_MEMORY_CONFIG } from './mongo-memory.config';

@Injectable()
export class MongoMemoryService extends DataMock {
  private connection: MongoMemoryServer;

  constructor(
    @Inject(MONGO_MEMORY) private readonly MemoryServer: MongoMemory,
    @Inject(MONGO_MEMORY_CONFIG) private readonly mongoMemoryConfig: any,
  ) {
    super();
    this.connection = new this.MemoryServer(mongoMemoryConfig);
  }

  public ensure() {
    return this.connection.ensureInstance();
  }

  public get uri(): Promise<string> {
    return this.connection.getConnectionString();
  }

  public stop() {
    return this.connection.stop();
  }
}
