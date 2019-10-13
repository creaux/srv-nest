import 'reflect-metadata';
import { LoggerService } from '../logger/logger.service';

export function MethodLogger() {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;
    descriptor.value = function(...args: any[]) {
      LoggerService.log(args, `${target.constructor.name}.${propertyKey}`);
      method.apply(this, [...args]);
    };
  };
}
