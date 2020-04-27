import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthSignInRequestDto } from '../src/auth/auth/dto/auth-sign-in-request.dto';
import { ConfigModule } from '../src/config/config.module';
import {
  Fiber, ImageModel,
  Injector, L10nModel,
  Mockeries,
  PostModel, RoleModel,
  SectionModel,
  UserModel
} from '@pyxismedia/lib-model';
import { MONGO_OPTIONS_TOKEN, MongoOptionsBuilder } from '../src/mongo/mongo-options.service';

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
    await fiber.createFromModel(RoleModel);
    await fiber.createFromModel(UserModel);
    user = mockeries.resolve<UserModel>(UserModel);

    dbUri = await fiber.dbUri;
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
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
