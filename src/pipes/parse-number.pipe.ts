import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseNumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const result = parseInt(value, 0);
    if (isNaN(result) && typeof value !== 'undefined') {
      throw new BadRequestException('You have to provide numeric value.');
    }
    return result;
  }
}
