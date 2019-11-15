import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LibraryModule } from '../library/library.module';
import { CONFIG_ACCESSORS, ConfigAccessors } from './config.accessors';

@Module({
  imports: [LibraryModule],
  providers: [
    ConfigService,
    {
      provide: CONFIG_ACCESSORS,
      useValue: ConfigAccessors,
    },
  ],
  exports: [ConfigService, CONFIG_ACCESSORS],
})
export class ConfigModule {}
