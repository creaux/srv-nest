import { LoggerService } from '../logger/logger.service';
import { ConfigFacade } from '../config/config.facade';
import { MongoMemoryService } from './mongo-memory/mongo-memory.service';

export async function mongooseOptionsFactory(
  env: ConfigFacade,
  logger: LoggerService,
  mongoMemory: MongoMemoryService,
) {
  if (env.isDevelopment) {
    await mongoMemory.ensure();
    await mongoMemory.importAll();

    logger.log(
      `INFO: Current MONGODB_URI is ${await mongoMemory.uri}`,
      'MongoModule',
    );

    return {
      uri: await mongoMemory.uri,
    };
  }

  logger.log(`MONGODB_URI is: ${env.MONGODB_URI}`, 'MongoModule');

  return {
    uri: env.MONGODB_URI,
  };
}
