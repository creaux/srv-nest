import { ConfigService } from '../config/config.service';
import { ConfigAccessors } from '../config/config.accessors';
import { LoggerService } from '../logger/logger.service';
import { EnvironmentService } from '../config/environment.service';
import { MongoMemoryService } from './mongo-memory/mongo-memory.service';

export async function mongooseOptionsFactory(
  env: EnvironmentService,
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
