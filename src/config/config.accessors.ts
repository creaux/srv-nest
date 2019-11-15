export const CONFIG_ACCESSORS = Symbol('KEYS');

export enum ConfigAccessors {
  MONGODB_URI = 'MONGODB_URI',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  LOG_LEVEL = 'LOG_LEVEL',
}
