import { UserByBearerPipe } from './user-by-bearer.pipe';
import { AuthService } from '../auth/auth.service';

describe('UserByBearerPipe', () => {
  it('should be defined', () => {
    expect(new UserByBearerPipe({} as AuthService)).toBeDefined();
  });
});
