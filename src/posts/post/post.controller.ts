import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { PostMongo } from './post.types';
import { CreatePostDto } from './create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from 'nest-logger';
import { MethodLogger } from 'src/decorators/method-logger.decorator';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @ApiOperation({ title: 'Request posts collection' })
  async findAll(@Query('skip') skip: string): Promise<PostMongo[]> {
    return await this.postService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  @ApiOperation({ title: 'Request post' })
  async findById(@Param('id') id: string): Promise<PostMongo> {
    return await this.postService.findById(id);
  }

  @Post()
  @ApiOperation({ title: 'Create Post' })
  @ApiResponse({
    status: 201,
    description: 'Post has been successfully created.',
  })
  @MethodLogger()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }
}
