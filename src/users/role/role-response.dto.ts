import { RoleModel } from '@pyxismedia/lib-model';
import { ApiModelProperty } from '@nestjs/swagger';

export class RoleResponseDto extends RoleModel {
  constructor(model: RoleResponseDto) {
    super(model);
    Object.assign(this, model);
  }

  @ApiModelProperty({
    type: String,
    example: RoleResponseDto.MOCK.id,
  })
  public readonly id: string;

  @ApiModelProperty({
    type: String,
    example: RoleResponseDto.MOCK.name,
  })
  public readonly name: string;
}
