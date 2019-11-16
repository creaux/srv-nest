import { Module } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as joi from 'joi';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ObjectSchema } from 'joi';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const JWT = Symbol.for('JWT');
export const BCRYPT = Symbol.for('BCRYPT');
export const JOI = Symbol.for('JOI');
export const DOTENV = Symbol.for('DOTENV');
export const FS = Symbol.for('FS');
export const MONGO_MEMORY = Symbol.for('MONGO_MEMORY');

export type Jwt = typeof jwt;
export type Bcrypt = typeof bcrypt;
export type Joi = typeof joi;
export type JoiObjectSchema = ObjectSchema;
export type DotEnv = typeof dotenv;
export type Fs = typeof fs;
export type MongoMemory = typeof MongoMemoryServer;

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
    {
      provide: MONGO_MEMORY,
      useValue: MongoMemoryServer,
    },
  ],
  exports: [JWT, BCRYPT, JOI, DOTENV, FS, MONGO_MEMORY],
})
export class LibraryModule {}
