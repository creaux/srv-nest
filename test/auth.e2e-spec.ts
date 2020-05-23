import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import {
  AuthSignInBuilder,
  CreateRoleModel,
  CreateUserModel,
  Fiber,
  Injector,
  L10nModel,
  Mockeries,
  UserModel,
} from '@pyxismedia/lib-model';
import {
  MONGO_OPTIONS_TOKEN,
  MongoOptionsBuilder,
} from '../src/mongo/mongo-options.service';
import { ConfigService } from '../src/config/config.service';

describe('AuthController (e2e)', () => {
  let app: any;
  let dbUri: string;
  let fiber: Fiber;
  let mockeries: Mockeries;
  let users: UserModel[];

  beforeAll(async () => {
    mockeries = Injector.resolve<Mockeries>(Mockeries);
    fiber = Injector.resolve<Fiber>(Fiber);
    mockeries.prepare(L10nModel);
    await fiber.createFromModel(CreateRoleModel, 2);
    await fiber.createFromModel(CreateUserModel, 2);
    users = mockeries.resolve<UserModel[]>(UserModel);
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
          .build(),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await fiber.tearDown();
  });

  it('/auth (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth')
      .send(
        new AuthSignInBuilder()
          .withEmail(users[0].email)
          .withPassword(users[0].password)
          .build(),
      )
      .expect(201)
      .expect((res: any) => {
        res.body.token.match(/\d/);
        res.body.createdAt.match(/\d/);
        res.body.id.match(/\d/);
      });
  });
});
