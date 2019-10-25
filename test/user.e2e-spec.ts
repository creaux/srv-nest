import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ConfigService } from '../src/config/config.module';
import { AuthSignInRequestDto } from '../src/auth/auth/auth-sign-in-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MemoryDb, Entities } from './memory-db';
import { UsersModule } from '../src/users/users.module';
import { AuthSuccessModel } from '../../lib-model/src/auth/auth-success.model';
import { UserModel } from '../../lib-model/src/user/user.model';

describe('UsersController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  let auth: AuthSuccessModel;

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(Entities.USERS);
    dbUri = await db.uri;
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

  it('/user (GET)', async () => {
    const all = db.get(Entities.USERS);
    const expected = all.map((user: UserModel) => {
      const { password, ...rest } = user;
      return rest;
    });
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(200)
      .expect(expected);
  });

  it('/user?skip=3 (GET)', async () => {
    const all = db.get(Entities.USERS);
    const expected = all
      .map((user: UserModel) => {
        const { password, ...rest } = user;
        return rest;
      })
      .slice(3);
    return request(app.getHttpServer())
      .get('/user?skip=3')
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(200)
      .expect(expected);
  });

  it('/user/:id (GET)', () => {
    const all = db.get(Entities.USERS)[0];
    const { password, ...expected } = all;
    return request(app.getHttpServer())
      .get(`/user/${db.get(Entities.USERS)[0].id}`)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(200)
      .expect(expected);
  });

  it('/user (POST)', async done => {
    return request(app.getHttpServer())
      .post('/user')
      .send(UserModel.MOCK)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(function(res) {
        return (
          res.body.forname === UserModel.MOCK.forname &&
          res.body.surname === UserModel.MOCK.surname &&
          res.body.email === UserModel.MOCK.email &&
          !res.body.password
        );
      })
      .then(() => {
        done();
      });
  });
});
