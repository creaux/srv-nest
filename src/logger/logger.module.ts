import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
