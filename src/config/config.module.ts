import { Module } from '@nestjs/common';
import { ConfigSingleton } from './config.singleton';

export const ConfigService = Symbol('ConfigService');

const configService = {
  provide: ConfigService,
  useValue: new ConfigSingleton(`${process.env.NODE_ENV || 'development'}.env`),
};

@Module({
  providers: [configService],
  exports: [configService],
})
export class ConfigModule {}
