import { ApiModelProperty } from '@nestjs/swagger';
import { PostState } from './post.types';
import { CreatePostModel } from '@pyxismedia/lib-model';
import { UserModel } from '../../users/user/user.types';

export class CreatePostDto implements CreatePostModel {
  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.title,
  })
  public readonly title: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.subtitle,
  })
  public readonly subtitle: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.content,
  })
  public readonly content: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.image,
  })
  public readonly image: string;

  @ApiModelProperty({
    enum: [PostState.DRAFT, PostState.PUBLISHED, PostState.ARCHIVED],
    type: PostState,
    example: PostState.DRAFT,
  })
  public readonly state: PostState;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.labels,
    isArray: true,
  })
  public readonly labels: string[];

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.createdBy,
  })
  public readonly createdBy: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.section,
  })
  public readonly section: string;
}
