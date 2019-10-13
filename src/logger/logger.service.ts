import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  public static logger: Logger;

  constructor() {
    super();

    LoggerService.logger = this;
  }

  public log(message: string) {
    super.log(message);
  }
  public error(message: string, trace: string) {
    super.error(message, trace);
  }
  public warn(message: string) {
    super.warn(message);
  }
  public debug(message: string) {
    super.debug(message);
  }
  public verbose(message: string) {
    super.verbose(message);
  }
}
