import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LibraryModule } from '../library/library.module';
import { CONFIG_ACCESSORS, ConfigAccessors } from './config.accessors';
import { LoggerModule } from '../logger/logger.module';
import { ConfigFacade } from './config.facade';
import { constants, CONSTANTS } from './constants/constants.service';

@Module({
  imports: [LibraryModule, LoggerModule],
  providers: [
    ConfigService,
    {
      provide: CONFIG_ACCESSORS,
      useValue: ConfigAccessors,
    },
    ConfigFacade,
    {
      provide: CONSTANTS,
      useValue: constants,
    },
  ],
  exports: [ConfigService, CONFIG_ACCESSORS, ConfigFacade, CONSTANTS],
})
export class ConfigModule {}
