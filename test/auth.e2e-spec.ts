import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import {
  CreateRoleModel,
  CreateUserModel,
  Fiber,
  Injector,
  L10nModel,
  Mockeries,
  UserModel,
} from '@pyxismedia/lib-model';
import { MONGO_OPTIONS_TOKEN, MongoOptionsBuilder } from '../src/mongo/mongo-options.service';
import { ConfigService } from '../src/config/config.service';

describe('AuthController (e2e)', () => {
  let app: any;
  let dbUri: string;
  let fiber: Fiber;
  let mockeries: Mockeries;
  let user: UserModel;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
    mockeries = Injector.resolve<Mockeries>(Mockeries);
    fiber = Injector.resolve<Fiber>(Fiber);
    mockeries.prepare(L10nModel);
    // TODO: How to make sure we know whether it should be an array or single value. Information is stored in MongooseSchema now
    // It causes cast to array issue then
    await fiber.createFromModel(CreateRoleModel, 2);
    await fiber.createFromModel(CreateUserModel);
    user = mockeries.resolve<UserModel>(UserModel);

    dbUri = await fiber.dbUri;
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({})
      .overrideProvider(MONGO_OPTIONS_TOKEN)
      .useValue(
        new MongoOptionsBuilder()
          .withUri(dbUri)
          .withUseNewUrlParser(true)
          .withUseUnifiedTopology(true)
          .build()
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    await fiber.tearDown();
  });

  it('/auth (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth')
      .send({
        email: user.email,
        password: user.password
      })
      .expect(201)
      .expect(function(res: any) {
        res.body.token.match(/\d/);
        // res.body.user.match(/\d/);
        res.body.createdAt.match(/\d/);
        res.body.id.match(/\d/);
      });
  });
});
