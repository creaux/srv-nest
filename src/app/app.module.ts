import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from '../posts/posts.module';
import { I18nModule } from '../i18n/i18n.module';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { LoggerService } from '../logger/logger.service';

@Module({
  imports: [I18nModule, PostsModule, ConfigModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, LoggerService],
  exports: [I18nModule],
})
export class AppModule {}
