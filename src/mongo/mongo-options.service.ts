import { Inject, Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { BuilderInterface } from '@pyxismedia/lib-model';

export const MONGO_OPTIONS_TOKEN = Symbol('MONGO_OPTIONS');

export class MongoOptions implements MongooseModuleOptions {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;

  constructor(options: MongoOptions) {
    Object.assign(this, options);
  }
}

export class MongoOptionsBuilder implements BuilderInterface<MongoOptions> {
  protected uri!: string;
  protected useNewUrlParser!: boolean;
  protected useUnifiedTopology!: boolean;

  withUri(uri: string) {
    this.uri = uri;
    return this;
  }

  withUseNewUrlParser(useNewUrlParser: boolean) {
    this.useNewUrlParser = useNewUrlParser;
    return this;
  }

  withUseUnifiedTopology(useUnifiedTopology: boolean) {
    this.useUnifiedTopology = useUnifiedTopology;
    return this;
  }

  build(): MongoOptions {
    return new MongoOptions({
      uri: this.uri,
      useNewUrlParser: this.useNewUrlParser,
      useUnifiedTopology: this.useUnifiedTopology,
    });
  }
}

@Injectable()
export class MongoOptionsService implements MongooseOptionsFactory {
  constructor(@Inject(MONGO_OPTIONS_TOKEN) private options: MongoOptions) {}

  public createMongooseOptions(): MongooseModuleOptions {
    return this.options;
  }
}
