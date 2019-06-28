import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { DotenvParseOutput } from 'dotenv';

enum Env {
  MONGODB_URI = 'MONGODB_URI',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
}

@Injectable()
export class ConfigSingleton {
  private readonly envConfig: Env;
  public readonly Env = Env;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    const envs: { [key: string]: string } = {};

    if (process.env.MONGODB_URI) {
      envs.MONGODB_URI = process.env.MONGODB_URI;
    }

    if (process.env.PORT) {
      envs.PORT = process.env.PORT;
    }

    // @ts-ignore
    this.envConfig = { ...this.validateInput((config as unknown) as Env), ...envs };
  }

  get(key: Env): Env {
    // @ts-ignore
    return this.envConfig[key];
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: Env): Env {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      [this.Env.NODE_ENV]: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      [this.Env.MONGODB_URI]: Joi.string(),
      [this.Env.PORT]: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
