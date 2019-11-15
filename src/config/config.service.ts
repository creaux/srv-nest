import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_ACCESSORS, ConfigAccessors } from './config.accessors';
import {
  DotEnv,
  DOTENV,
  Fs,
  FS,
  Joi,
  JOI,
  JoiObjectSchema,
} from '../library/library.module';

const { entries, keys } = Object;

interface KValue {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private static DEFAULT = 'production';
  private readonly schema: JoiObjectSchema = this.joi.object({
    [this.accessors.NODE_ENV]: this.joi
      .string()
      .valid(['development', 'production', 'test'])
      .default(ConfigService.DEFAULT),
    [this.accessors.MONGODB_URI]: this.joi.string().exist(),
    [this.accessors.PORT]: this.joi.string().exist(),
    [this.accessors.LOG_LEVEL]: this.joi
      .string()
      .valid(['debug', 'info', 'warn', 'error'])
      .default('error'),
  });

  private readonly config: Map<string, string>;

  private get system(): KValue {
    const variables: KValue = {};

    keys(this.accessors).forEach(key => {
      variables[key] = process.env[key];
    });

    return variables;
  }

  private get dot(): KValue {
    const environment = process.env.NODE_ENV
      ? process.env.NODE_ENV
      : ConfigService.DEFAULT;

    const variables = this.dotenv.parse(
      this.fs.readFileSync(`${environment}.env`),
    );

    return variables;
  }

  private validate(variables: KValue): KValue {
    const validated = this.joi.validate<KValue>(variables, this.schema);
    const { error, value } = validated;

    if (error) {
      throw new Error(`Environmental variables are missing: ${error.message}`);
    }

    return value;
  }

  constructor(
    @Inject(CONFIG_ACCESSORS)
    private readonly accessors: typeof ConfigAccessors,
    @Inject(JOI) private readonly joi: Joi,
    @Inject(DOTENV) private readonly dotenv: DotEnv,
    @Inject(FS) private readonly fs: Fs,
  ) {
    let config = {};

    try {
      config = { ...config, ...this.dot };
    } catch {
      //
    }

    try {
      config = { ...config, ...this.system };
    } catch {
      //
    }

    this.config = new Map(entries(this.validate(config)));
  }

  public get(key: ConfigAccessors): any {
    return this.config.get(key);
  }
}
