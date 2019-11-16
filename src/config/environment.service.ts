import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_ACCESSORS, ConfigAccessors } from './config.accessors';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly config: ConfigService,
    @Inject(CONFIG_ACCESSORS)
    private readonly accessors: typeof ConfigAccessors,
  ) {}

  public get isDevelopment(): boolean {
    return this.config.get(this.accessors.NODE_ENV) === 'development';
  }

  public get MONGODB_URI(): string {
    return this.config.get(this.accessors.MONGODB_URI);
  }
}
