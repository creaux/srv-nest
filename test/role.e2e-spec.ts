import { MemoryDb } from './memory-db';
import {
  AuthSuccessModel,
  DataMockEntities,
  CreateRoleModel,
} from '@pyxismedia/lib-model';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigService } from '../src/config/config.module';
import { AuthSignInRequestDto } from '../src/auth/auth/auth-sign-in-request.dto';
import * as request from 'supertest';

describe('RoleController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  let auth: AuthSuccessModel;

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.ROLES);
    db.import(DataMockEntities.USERS);
    dbUri = await db.uri;
    await db.ensure();
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get() {
          return dbUri;
        },
        Env: {},
      })
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await db.stop();
  });

  describe('unauthentized', () => {
    it('/role (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/role')
        .expect(401)
        .expect({ statusCode: 401, error: 'Unauthorized' });
    });
  });

  describe('authentized', () => {
    beforeAll(async () => {
      auth = await request(app.getHttpServer())
        .post('/auth')
        .send(
          new AuthSignInRequestDto({
            email: 'karel@vomacka.cz',
            password: '12345',
          }),
        )
        .then(res => {
          return res.body;
        });
    });

    it('/role (GET)', async () => {
      const expected = db.get(DataMockEntities.ROLES);
      return await request(app.getHttpServer())
        .get('/role')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .expect(expected);
    });

    it('/role/:id (GET)', async () => {
      const expected = db.get(DataMockEntities.ROLES);
      return await request(app.getHttpServer())
        .get(`/role/${expected[0].id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .expect(expected[0]);
    });

    it('/role (POST) 201 Created', async () => {
      const response = await request(app.getHttpServer())
        .post('/role')
        .send(CreateRoleModel.MOCK)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(201)
        .expect(response => response.body.name === CreateRoleModel.MOCK.name);

      await request(app.getHttpServer())
        .delete(`/role/${response.body.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .expect(response.body);
    });

    it('/role (DELETE) 200 Deleted', async () => {
      const response = await request(app.getHttpServer())
        .post('/role')
        .send(CreateRoleModel.MOCK)
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
      const existing = db.get(DataMockEntities.ROLES);
      await request(app.getHttpServer())
        .post('/role')
        .send(existing[0])
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
