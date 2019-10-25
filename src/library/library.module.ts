import { Module } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export const JwtToken = Symbol.for('jwt');
export const BcryptToken = Symbol.for('bcrypt');

export type Jwt = typeof jwt;
export type Bcrypt = typeof bcrypt;

@Module({
  providers: [
    {
      provide: JwtToken,
      useValue: jwt,
    },
    {
      provide: BcryptToken,
      useValue: bcrypt,
    },
  ],
  exports: [JwtToken, BcryptToken],
})
export class LibraryModule {}
