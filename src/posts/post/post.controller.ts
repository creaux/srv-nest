import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  Delete,
  SetMetadata,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './create-post.dto';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostModel, PostSchemaInterface } from '@pyxismedia/lib-model';
import { DeletePostModel } from '@pyxismedia/lib-model/build/post/delete-post.model';
import { UseRoles } from 'nest-access-control/lib';
import { AccessGuard } from '../../users/access.guard';
import { ParseObjectIdPipe } from '../../pipes/parse-object-id.pipe';
import { ParseNumberPipe } from '../../pipes/parse-number.pipe';
import { ValidationPipe } from '../../pipes/validation.pipe';

// TODO: Filter out fields which we don't want to send to client
// TODO: Put operation
@Controller('post')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'post', action: 'read', possession: 'any' })
  @Get()
  @ApiOperation({ title: 'Request posts collection' })
  async findAll(
    @Query('skip', ParseNumberPipe) skip: string,
  ): Promise<PostModel[]> {
    return await this.postService.findAll(parseInt(skip, 0));
  }

  @Get(':id')
  @ApiOperation({ title: 'Request post' })
  @UseGuards(AccessGuard)
  @UseRoles({ resource: 'post', action: 'read', possession: 'any' })
  async findById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<PostModel> {
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
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @UseRoles({ resource: 'post', action: 'create', possession: 'any' })
  async createPost(
    @Body(ValidationPipe)
    createPostDto: CreatePostDto,
  ): Promise<PostSchemaInterface> {
    return await this.postService.create(createPostDto);
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete Post' })
  @ApiResponse({
    status: 200,
    description: 'Post has been successfully deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Deleting of Post requires authentification',
  })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @UseRoles({ resource: 'post', action: 'delete', possession: 'any' })
  async deletePost(@Param('id', ParseObjectIdPipe) id: string) {
    const deletePost = new DeletePostModel({ id });
    const result = await this.postService.delete(deletePost.id);
    return result;
  }
}
