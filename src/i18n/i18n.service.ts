import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class I18nService {
  constructor(
    // @ts-ignore
    @InjectConnection() private readonly connection,
  ) {}

  setLanguage(request: Request) {
    // @ts-ignore
    if (request.headers['accept-language']) {
      // @ts-ignore
      const language = request.headers['accept-language'].substring(0, 2);
      // Issue with webpack maybe cause imports *
      this.connection.setDefaultLanguage(language);
    }
  }
}
