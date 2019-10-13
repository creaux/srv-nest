import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section/section.service';
import { PostController } from './post/post.controller';
import { PostSchema, SectionSchema } from '@pyxismedia/lib-model';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Section', schema: SectionSchema },
    ]),
    LoggerModule,
  ],
  providers: [PostService, SectionService],
  controllers: [PostController],
})
export class PostsModule {}
