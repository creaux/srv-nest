import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value, {
      excludeExtraneousValues: true,
      excludePrefixes: ['_'],
    });
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors, 'Request validation failed');
    }
    // TODO new Model
    return object;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Array<Type<any>> = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
