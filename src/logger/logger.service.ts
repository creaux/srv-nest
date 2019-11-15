import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  public static logger: Logger;

  constructor() {
    super();

    LoggerService.logger = this;
  }

  public log(message: string, context?: string) {
    super.log(message, context);
  }
  public error(message: string, trace: string, context?: string) {
    super.error(message, trace, context);
  }
  public warn(message: string, context?: string) {
    super.warn(message, context);
  }
  public debug(message: string, context?: string) {
    super.debug(message, context);
  }
  public verbose(message: string, context?: string) {
    super.verbose(message, context);
  }
}
