import {
  CreateRoleModel,
  Fiber,
  Injector,
  RoleModel,
  UserModel,
  AccessModel,
  Mockeries,
  L10nModel,
} from '@pyxismedia/lib-model';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { AuthSignInRequestDto } from '../src/auth/auth/dto/auth-sign-in-request.dto';
import * as request from 'supertest';
import { AuthSignInResponseDto } from '../src/auth/auth/dto/auth-sign-in-response.dto';
import {
  MONGO_OPTIONS_TOKEN,
  MongoOptionsBuilder,
} from '../src/mongo/mongo-options.service';

describe('RoleController (e2e)', () => {
  let app: any;
  let fiber: Fiber;
  let mockeries: Mockeries;
  let roles: RoleModel[];
  let dbUri: string;
  let users: UserModel[];

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
    mockeries = Injector.resolve<Mockeries>(Mockeries);
    fiber = Injector.resolve<Fiber>(Fiber);
    mockeries.prepare(L10nModel);
    await fiber.createFromModel(RoleModel, 3);
    await fiber.createFromModel(UserModel);
    await fiber.createFromModel(AccessModel);
    roles = mockeries.resolve<RoleModel[]>(RoleModel);
    users = mockeries.resolve<UserModel[]>(UserModel);
    const accesses = mockeries.resolve(AccessModel);
    dbUri = await fiber.dbUri;
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    })
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    await fiber.tearDown();
  });

  describe('unauthentized', () => {
    it('/role (GET)', () => {
      request(app.getHttpServer())
        .get('/role')
        .expect(401)
        .expect({ statusCode: 401, error: 'Unauthorized' });
    });
  });

  describe('authentized', () => {
    describe('access rights - none', () => {
      let auth: AuthSignInResponseDto;

      beforeEach(async () => {
        auth = await request(app.getHttpServer())
          .post('/auth')
          .send(
            new AuthSignInRequestDto({
              email: 'tonda@zakaznik.cz',
              password: '12345',
            }),
          )
          .then(res => res.body);
      });

      it('/role (GET)', () => {
        request(app.getHttpServer())
          .get('/role')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            error: 'Forbidden',
            message: 'Forbidden resource',
            statusCode: 403,
          });
      });

      it('/role/:id (GET)', () => {
        request(app.getHttpServer())
          .get(`/role/${roles[0].id}`)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            error: 'Forbidden',
            message: 'Forbidden resource',
            statusCode: 403,
          });
      });

      it('/role (POST) 201 Created', () => {
        request(app.getHttpServer())
          .post('/role')
          .send(CreateRoleModel.MOCK)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            error: 'Forbidden',
            message: 'Forbidden resource',
            statusCode: 403,
          });
      });

      it('/role (DELETE) 200 Deleted', () => {
        const newRole = mockeries.create(RoleModel);
        request(app.getHttpServer())
          .post('/role')
          .send(newRole)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            error: 'Forbidden',
            message: 'Forbidden resource',
            statusCode: 403,
          });
      });
    });

    describe('access rights - any', () => {
      let auth: AuthSignInResponseDto;

      beforeEach(async () => {
        auth = await request(app.getHttpServer())
          .post('/auth')
          .send(
            new AuthSignInRequestDto({
              email: 'karel@vomacka.cz',
              password: '12345',
            }),
          )
          .then(res => res.body);
      });

      it('/role (GET)', () => {
        request(app.getHttpServer())
          .get('/role')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect(roles);
      });

      it('/role/:id (GET)', () => {
        request(app.getHttpServer())
          .get(`/role/${roles[0].id}`)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect(roles[0]);
      });

      it('/role (POST) 201 Created', async () => {
        const newRole = mockeries.create<RoleModel>(RoleModel);
        const response = await request(app.getHttpServer())
          .post('/role')
          .send(newRole)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(201)
          .expect(response => response.body.name === CreateRoleModel.MOCK.name);

        request(app.getHttpServer())
          .delete(`/role/${response.body.id}`)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect(response.body);
      });

      it('/role (DELETE) 200 Deleted', async () => {
        const newRole = mockeries.create(RoleModel);
        const response = await request(app.getHttpServer())
          .post('/role')
          .send(newRole)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(201)
          .expect(response => response.body.name === CreateRoleModel.MOCK.name);

        await request(app.getHttpServer())
          .delete(`/role/${response.body.id}`)
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect(response.body);
      });

      it('/role (POST) 409 Conflict', async () => {
        await request(app.getHttpServer())
          .post('/role')
          .send(roles[0])
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(409)
          .expect({
            statusCode: 409,
            error: 'Conflict',
            message: 'Role with the same name already exists.',
          });
      });
    });
  });
});
