import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section/section.service';
import { PostController } from './post/post.controller';
import { PostSchema, SectionSchema } from '@pyxismedia/lib-model';
import { LoggerModule } from '../logger/logger.module';
import { MongoModule } from '../mongo/mongo.module';
import { PipesModule } from '../pipes/pipes.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Section', schema: SectionSchema },
    ]),
    LoggerModule,
    PipesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [PostService, SectionService],
  controllers: [PostController],
})
export class PostsModule {}
