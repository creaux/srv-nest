import { Module } from '@nestjs/common';
import { ValidationPipe } from './validation.pipe';
import { ParseObjectIdPipe } from './parse-object-id.pipe';
import { ParseNumberPipe } from './parse-number.pipe';

@Module({
  providers: [ValidationPipe, ParseObjectIdPipe, ParseNumberPipe],
  exports: [ValidationPipe, ParseObjectIdPipe, ParseNumberPipe],
})
export class PipesModule {}
