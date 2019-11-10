import { UserPopulatedModel } from '@pyxismedia/lib-model';

export class UserResponseDto extends UserPopulatedModel {
  constructor(model: UserResponseDto) {
    super(model);

    Object.assign(this, model);
  }
}
