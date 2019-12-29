import { createParamDecorator } from '@nestjs/common';

export const Call = createParamDecorator((data, req) => {
  return req;
});
