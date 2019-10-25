import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { tap } from 'rxjs/operators';
import { stringify } from 'flatted';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    this.logger.log(`REQUEST:\n\n${stringify(request.query, null, 2)}\n`);
    return next.handle().pipe(
      tap(response => {
        this.logger.log(`RESPONSE:\n\n${stringify(response, null, 2)}\n`);
      }),
    );
  }
}
