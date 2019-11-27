import { ApiModelProperty } from '@nestjs/swagger';
import { AuthSignInModel } from '@pyxismedia/lib-model';

export const AUTH_MODEL = 'Auth';

export class AuthSignInRequestDto implements AuthSignInModel {
  constructor(model: AuthSignInRequestDto) {
    Object.assign(this, model);
  }

  @ApiModelProperty({
    type: String,
    example: AuthSignInModel.MOCK.email,
  })
  readonly email: string;

  @ApiModelProperty({
    type: String,
    example: AuthSignInModel.MOCK.password,
  })
  readonly password: string;
}
