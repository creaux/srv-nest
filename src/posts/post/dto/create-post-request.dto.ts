import { ApiModelProperty } from '@nestjs/swagger';
import { PostState } from '../post.types';
import { IsDefined, IsEnum, IsMongoId } from 'class-validator';
import { PostStateEnum, CreatePostModel } from '@pyxismedia/lib-model';
import { UserExistsConstrain } from '../../../users/constraints/user-exists.constrain';
import { SectionExistsConstrain } from '../../constraints/section-exists.constrain';
import { Expose } from 'class-transformer';

export class CreatePostRequestDto extends CreatePostModel {
  @ApiModelProperty({
    enum: [PostState.DRAFT, PostState.PUBLISHED, PostState.ARCHIVED],
    type: PostState,
    example: PostState.DRAFT,
  })
  @IsEnum(PostStateEnum)
  @IsDefined()
  @Expose()
  public readonly state: PostState;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.createdBy,
  })
  @IsDefined()
  @UserExistsConstrain.decorator()
  @IsMongoId()
  @Expose()
  public readonly createdBy: string;

  @ApiModelProperty({
    type: String,
    example: CreatePostModel.MOCK.section,
  })
  @SectionExistsConstrain.decorator()
  @IsMongoId()
  @Expose()
  public readonly section: string;

  constructor(model: CreatePostRequestDto) {
    super(model);

    Object.assign(this, model);
  }
}
