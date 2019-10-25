import { UserModel } from '@pyxismedia/lib-model';

export class UserResponseDto extends UserModel {
  constructor(partial: Partial<UserResponseDto>) {
    super(partial);

    Object.assign(this, partial);
  }
}
