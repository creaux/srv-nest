import { DeleteRoleModel } from '@pyxismedia/lib-model';

export class DeleteRoleRequestDto extends DeleteRoleModel {
  constructor(model: DeleteRoleRequestDto) {
    super(model);
    Object.assign(this, model);
  }
}
