import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthSignInRequestDto } from '../src/auth/auth/dto/auth-sign-in-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MemoryDb } from './memory-db';
import { UsersModule } from '../src/users/users.module';
import {
  DataMockEntities,
  UserModel,
} from '@pyxismedia/lib-model';
import { ConfigService } from '../src/config/config.service';
import { AuthSignInResponseDto } from "../src/auth/auth/dto/auth-sign-in-response.dto";

describe('UsersController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.USERS);
    db.import(DataMockEntities.ACCESS);
    db.import(DataMockEntities.ROLES);
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

  describe("access rights - any", () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post("/auth")
        .send(
          new AuthSignInRequestDto({
            email: "karel@vomacka.cz",
            password: "12345"
          })
        )
        .then(res => res.body);
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

    it('/user (GET)', async () => {
      const all = db.get(DataMockEntities.USERS);
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
      const all = db.get(DataMockEntities.USERS);
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
      const all = db.get(DataMockEntities.USERS)[0];
      const { password, ...expected } = all;
      return request(app.getHttpServer())
        .get(`/user/${db.get(DataMockEntities.USERS)[0].id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .expect(expected);
    });
  });

  describe("access rights - none", () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post("/auth")
        .send(
          new AuthSignInRequestDto({
            email: "tonda@zakaznik.cz",
            password: "12345"
          })
        )
        .then(res => res.body);
    });

    it('/user (POST)',() => {
      return request(app.getHttpServer())
        .post('/user')
        .send(UserModel.MOCK)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          "error": "Forbidden",
          "message": "Forbidden resource",
          "statusCode": 403
        });
    });

    it('/user (GET)', async () => {
      const all = db.get(DataMockEntities.USERS);
      const expected = all.map((user: UserModel) => {
        const { password, ...rest } = user;
        return rest;
      });
      return request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          "error": "Forbidden",
          "message": "Forbidden resource",
          "statusCode": 403
        });
    });

    it('/user?skip=3 (GET)', async () => {
      const all = db.get(DataMockEntities.USERS);
      const expected = all
        .map((user: UserModel) => {
          const { password, ...rest } = user;
          return rest;
        })
        .slice(3);
      return request(app.getHttpServer())
        .get('/user?skip=3')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          "error": "Forbidden",
          "message": "Forbidden resource",
          "statusCode": 403
        });
    });

    it('/user/:id (GET)', () => {
      const all = db.get(DataMockEntities.USERS)[0];
      const { password, ...expected } = all;
      return request(app.getHttpServer())
        .get(`/user/${db.get(DataMockEntities.USERS)[0].id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          "error": "Forbidden",
          "message": "Forbidden resource",
          "statusCode": 403
        });
    });
  });
});
