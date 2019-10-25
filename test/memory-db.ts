import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataMock } from '@pyxismedia/lib-model';

export class MemoryDb extends DataMock {
  private connection: MongoMemoryServer;

  constructor() {
    super();
    this.connection = new MongoMemoryServer();
  }

  public get uri(): Promise<string> {
    return this.connection.getConnectionString();
  }
}
