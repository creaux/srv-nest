// TODO https://docs.nestjs.com/pipes

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly logger: LoggerService) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      this.logger.log(JSON.stringify(errors), 'ValidationPipe');
      throw new BadRequestException(errors, 'Request validation failed');
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Array<Type<any>> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
