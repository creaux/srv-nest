import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'userExists', async: true })
@Injectable()
export class UserExistsConstrain implements ValidatorConstraintInterface {
  public static decorator() {
    return (object: object, propertyName: string) => {
      registerDecorator({
        propertyName,
        target: object.constructor,
        validator: UserExistsConstrain,
      });
    };
  }

  constructor(private readonly userService: UserService) {}

  async validate(id: string) {
    if (Types.ObjectId.isValid(id)) {
      return !!(await this.userService.findById(id));
    }
    return true;
  }

  public defaultMessage(args?: ValidationArguments): string {
    return `Property ${args.property} contain incorrect non existing user id ${args.value}`;
  }
}
