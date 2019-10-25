import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DeserializePipe implements PipeTransform {
  constructor() {}
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('deserialize:', value);
    return value;
  }
}
