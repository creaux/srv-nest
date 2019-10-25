import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DeserializePipe implements PipeTransform {
  // @ts-ignore
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
