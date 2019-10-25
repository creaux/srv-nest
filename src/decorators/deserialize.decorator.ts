import { createParamDecorator } from '@nestjs/common';

export const Model = createParamDecorator((data, req) => {
  return req;
});
