import {
  Inject,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
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
import { LoggerService } from '../logger/logger.service';

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

    this.logger.log(`Loading ${environment}.env file`, 'ConfigService');

    const variables = this.dotenv.parse(
      this.fs.readFileSync(`${environment}.env`),
    );

    this.logger.log(`MONGODB_URI is ${variables.MONGODB_URI}`);
    this.logger.log(`PORT is ${variables.PORT}`);

    return variables;
  }

  private validate(variables: KValue): KValue {
    const validated = this.joi.validate<KValue>(variables, this.schema, {
      allowUnknown: true,
    });
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
    private readonly logger: LoggerService,
  ) {
    this.logger.log(
      `Environment variable NODE_ENV value is ${process.env.NODE_ENV}`,
      'ConfigService',
    );

    let config = {};

    try {
      config = { ...config, ...this.validate(this.dot) };
    } catch (err1) {
      try {
        config = { ...config, ...this.validate(this.system) };
      } catch (err2) {
        throw new InternalServerErrorException(
          `DOTENV VARIABLES: ${err1.message} SYSTEM VARIABLES: ${err2.message}`,
        );
      }
    }

    this.config = new Map(entries(this.validate(config)));
  }

  public get(key: ConfigAccessors): any {
    return this.config.get(key);
  }
}
