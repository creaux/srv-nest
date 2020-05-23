import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

export class DefaultValidationPipe extends ValidationPipe {
  constructor(options: ValidationPipeOptions = {}) {
    super(
      Object.assign(options, {
        transform: true,
        exceptionFactory: (errors: ValidationError[]) => {
          let message = '';
          for (const error of errors) {
            for (const constraint in error.constraints) {
              if (error.constraints.hasOwnProperty(constraint)) {
                message += error.constraints[constraint] + ', ';
              }
            }
          }
          message = message.substring(0, message.length - 2);
          throw new BadRequestException(`Validation errors: ${message}`);
        },
      }),
    );
  }
}
