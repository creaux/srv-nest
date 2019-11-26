import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SectionService } from '../section/section.service';
import { Types } from 'mongoose';

@ValidatorConstraint({ name: 'sectionExists', async: true })
@Injectable()
export class SectionExistsConstrain implements ValidatorConstraintInterface {
  public static decorator() {
    return (object: object, propertyName: string) => {
      registerDecorator({
        propertyName,
        target: object.constructor,
        validator: SectionExistsConstrain,
      });
    };
  }

  constructor(private readonly sectionService: SectionService) {}

  public async validate(id: string): Promise<boolean> {
    if (Types.ObjectId.isValid(id)) {
      return !!(await this.sectionService.findById(id));
    }
    return true;
  }

  public defaultMessage(args?: ValidationArguments): string {
    return `Property ${args.property} contains incorrect non existing ${args.property} id ${args.value}`;
  }
}
