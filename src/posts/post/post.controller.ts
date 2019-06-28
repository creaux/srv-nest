import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(@Query('skip') skip: string) {
    return await this.postService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.postService.findById(id);
  }
}
