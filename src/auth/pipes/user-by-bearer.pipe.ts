import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserByBearerPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (value && value.headers) {
      const { authorization } = value.headers;
      if (typeof authorization === 'string') {
        const token = authorization.split(' ')[1];
        const validation = await this.authService.validateUser(token);
        if (validation != null) {
          return validation.user;
        }
      }
    }
    return null;
  }
}
