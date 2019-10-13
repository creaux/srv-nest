import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

const { entries } = Object;

export enum Env {
  MONGODB_URI = 'MONGODB_URI',
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  LOG_LEVEL = 'LOG_LEVEL',
  LOG_NAME = 'LOG_NAME',
  LOG_APPENDERS = 'LOG_APPENDERS',
}

export class ConfigSingleton {
  private readonly envConfig: Map<string, string>;
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

    this.envConfig = new Map(
      entries({
        // @ts-ignore
        ...this.validateInput((config as unknown) as Env),
        ...envs,
      }),
    );
  }

  get(key: Env): any {
    return this.envConfig.get(key);
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
      [this.Env.LOG_LEVEL]: Joi.string()
        .valid(['debug', 'info', 'warn', 'error'])
        .default('error'),
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
