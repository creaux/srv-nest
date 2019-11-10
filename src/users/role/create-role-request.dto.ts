import { CreateRoleModel } from '../../../../lib-model/src/user/create-role.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateRoleRequestDto extends CreateRoleModel {
  constructor(model: CreateRoleRequestDto) {
    super(model);
    Object.assign(this, model);
  }

  @ApiModelProperty({
    type: String,
    example: CreateRoleRequestDto.MOCK.name,
  })
  public readonly name: string;
}
