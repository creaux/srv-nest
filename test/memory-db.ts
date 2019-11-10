import { MongoMemoryServer } from 'mongodb-memory-server';
import { DataMock } from '@pyxismedia/lib-model';
import { MongoMemoryServerOptsT } from 'mongodb-memory-server-core/lib/MongoMemoryServer';

export class MemoryDb extends DataMock {
  private connection: MongoMemoryServer;

  constructor(options?: MongoMemoryServerOptsT) {
    super();
    this.connection = new MongoMemoryServer(options);
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
