import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './post/post.schema';
import { SectionService } from './section/section.service';
import { SectionSchema } from './section/section.schema';
import { PostController } from './post/post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'Section', schema: SectionSchema },
    ]),
  ],
  providers: [PostService, SectionService],
  controllers: [PostController],
})
export class PostsModule {}
