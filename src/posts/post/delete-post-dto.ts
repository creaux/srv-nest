import { DeletePostModel } from '../../../../lib-model/src/post/delete-post.model';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsDefined } from 'class-validator';

export class DeletePostDto extends DeletePostModel {
  @ApiModelProperty({ type: String })
  @IsMongoId()
  @IsDefined()
  public readonly id!: string;
}
