import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { I18nMiddleware } from './i18n.middleware';
import { I18nService } from './i18n.service';

@Module({
  providers: [I18nService],
})
export class I18nModule {
  configure(i18n: MiddlewareConsumer) {
    i18n
      .apply(I18nMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
