export const MONGO_MEMORY_CONFIG = Symbol.for('MONGO_MEMORY_CONFIG');

export const mongoMemoryConfig = {
  instance: {
    port: 27018,
    dbName: 'memorydb',
  },
};
