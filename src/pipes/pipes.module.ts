import { Module } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { ParseObjectIdPipe } from './parse-object-id.pipe';
import { ParseNumberPipe } from './parse-number.pipe';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [ValidationPipe, ParseObjectIdPipe, ParseNumberPipe],
  exports: [ValidationPipe, ParseObjectIdPipe, ParseNumberPipe],
})
export class PipesModule {}
