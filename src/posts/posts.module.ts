import { Module } from '@nestjs/common';
import { PostService } from './post/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SectionService } from './section/section.service';
import { PostController } from './post/post.controller';
import {
  PostSchema,
  SectionSchema,
  SectionExistsConstrain,
  SECTION_SERVICE_TOKEN,
  SchemaName,
} from '@pyxismedia/lib-model';
import { LoggerModule } from '../logger/logger.module';
import { MongoModule } from '../mongo/mongo.module';
import { PipesModule } from '../pipes/pipes.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: SchemaName.POST, schema: PostSchema },
      { name: SchemaName.SECTION, schema: SectionSchema },
    ]),
    LoggerModule,
    PipesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: SECTION_SERVICE_TOKEN,
      useClass: SectionService,
    },
    PostService,
    SectionService,
    SectionExistsConstrain,
  ],
  controllers: [PostController],
  exports: [SectionExistsConstrain],
})
export class PostsModule {}
