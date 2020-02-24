let MongoMemoryServer: object;

try {
  // tslint:disable-next-line:no-var-requires
  const {
    MongoMemoryServer: MongoMemoryServerDep,
  } = require('mongodb-memory-server');
  MongoMemoryServer = MongoMemoryServerDep;
} catch (e) {
  MongoMemoryServer = {};
}

type MongoMemory = typeof MongoMemoryServer;
const MONGO_MEMORY = Symbol('MONGO_MEMORY');

export { MongoMemory, MONGO_MEMORY, MongoMemoryServer };
