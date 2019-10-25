import { LoggerService } from '../logger/logger.service';

export const MethodLogger = () => {
  const logger = new LoggerService();
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = new Proxy(original, {
      apply(targets, thisArg, args) {
        logger.log(`Call with args: ${JSON.stringify(args)}`);
        const result = targets.apply(thisArg, args);
        logger.log(`Return: ${JSON.stringify(result)}`);
        return result;
      },
    });
  };
};
