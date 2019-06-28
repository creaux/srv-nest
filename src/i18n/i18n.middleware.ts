import { Injectable, NestMiddleware } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  constructor(private readonly i18nService: I18nService) {}

  use(request: Request, response: Response, next: () => void) {
    this.i18nService.setLanguage(request);
    next();
  }
}
