import { ApiModelProperty } from '@nestjs/swagger';
import { CreateUserModel } from '@pyxismedia/lib-model';

export class CreateUserRequestDto extends CreateUserModel {
  constructor(model: CreateUserModel) {
    super(model);
    Object.assign(this, model);
  }

  @ApiModelProperty()
  readonly forname: string;

  @ApiModelProperty()
  readonly surname: string;

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  readonly password: string;
}

export const USER_MODEL = 'User';
