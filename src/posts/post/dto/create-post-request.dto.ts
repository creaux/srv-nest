import { ApiModelProperty } from '@nestjs/swagger';
import { PostState } from '../post.types';
import { CreatePostModel } from '@pyxismedia/lib-model';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { PostStateEnum } from '@pyxismedia/lib-model';
import { UserExistsConstrain } from '../../../users/constraints/user-exists.constrain';
import { SectionExistsConstrain } from '../../constraints/section-exists.constrain';

export class CreatePostRequestDto implements CreatePostModel {
  @ApiModelProperty({
    required: true,
    type: String,
    example: CreatePostModel.MOCK.title,
  })
  @IsString()
  @Length(1, 120)
  @IsDefined()
  public readonly title: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.subtitle,
  })
  @IsString()
  @Length(1, 360)
  @IsDefined()
  public readonly subtitle: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.content,
  })
  @IsString()
  @Length(1)
  @IsDefined()
  public readonly content: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.image,
  })
  @IsUrl()
  @IsDefined()
  public readonly image: string;

  @ApiModelProperty({
    enum: [PostState.DRAFT, PostState.PUBLISHED, PostState.ARCHIVED],
    type: PostState,
    example: PostState.DRAFT,
  })
  @IsEnum(PostStateEnum)
  @IsDefined()
  public readonly state: PostState;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.labels,
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  public readonly labels: string[];

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.createdBy,
  })
  @IsDefined()
  @UserExistsConstrain.decorator()
  @IsMongoId()
  public readonly createdBy: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.section,
  })
  @SectionExistsConstrain.decorator()
  @IsMongoId()
  public readonly section: string;

  public constructor(model: CreatePostRequestDto) {
    Object.assign(this, model);
  }
}
