import { Module } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ObjectSchema } from 'joi';

export const JWT = Symbol.for('JWT');
export const BCRYPT = Symbol.for('BCRYPT');
export const JOI = Symbol.for('JOI');
export const DOTENV = Symbol.for('DOTENV');
export const FS = Symbol.for('FS');

export type Jwt = typeof jwt;
export type Bcrypt = typeof bcrypt;
export type Joi = typeof joi;
export type JoiObjectSchema = ObjectSchema;
export type DotEnv = typeof dotenv;
export type Fs = typeof fs;

@Module({
  providers: [
    {
      provide: JWT,
      useValue: jwt,
    },
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
    {
      provide: JOI,
      useValue: joi,
    },
    {
      provide: DOTENV,
      useValue: dotenv,
    },
    {
      provide: FS,
      useValue: fs,
    },
  ],
  exports: [JWT, BCRYPT, JOI, DOTENV, FS],
})
export class LibraryModule {}
