import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostModel } from '@pyxismedia/lib-model';
import { DeletePostModel } from '../../../../lib-model/src/post/delete-post.model';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { ValidationPipe } from '../../pipes/validation.pipe';

@UseInterceptors(LoggerInterceptor)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({ title: 'Request posts collection' })
  // TODO: Model for request
  async findAll(@Query('skip') skip: string): Promise<PostModel[]> {
    return await this.postService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  @ApiOperation({ title: 'Request post' })
  // TODO: Model for request
  async findById(@Param('id') id: string): Promise<PostModel> {
    return await this.postService.findById(id);
  }

  @Post()
  @ApiOperation({ title: 'Create Post' })
  @ApiResponse({
    status: 201,
    description: 'Post has been successfully created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Post creations requires authetification',
  })
  @UseGuards(AuthGuard('bearer'))
  async createPost(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
  ): Promise<PostModel> {
    return await this.postService.create(createPostDto);
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete Post' })
  @ApiResponse({
    status: 201,
    description: 'Post has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Deleting of Post requires authentification',
  })
  // TODO: Model for request
  async deletePost(@Param('id') id: string) {
    const deletePost = new DeletePostModel(id);
    const result = await this.postService.delete(deletePost.id);
    return result;
  }
}
