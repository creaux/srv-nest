import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthSignInRequestDto } from '../src/auth/auth/dto/auth-sign-in-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MemoryDb } from './memory-db';
import { UsersModule } from '../src/users/users.module';
import { ConfigService } from '../src/config/config.service';
import { AuthSignInResponseDto } from '../src/auth/auth/dto/auth-sign-in-response.dto';
import { Mockeries, Schema, UserModel } from '@pyxismedia/lib-model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { model, connect } from 'mongoose';

describe('UsersController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  let userModelMock: UserModel[];

  beforeAll(async () => {
    // db = new MemoryDb();
    // db.import(DataMockEntities.USERS);
    // db.import(DataMockEntities.ACCESS);
    // db.import(DataMockEntities.ROLES);
    // dbUri = await db.uri;
    // await db.ensure();
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
    const connection = new MongoMemoryServer();
    await connection.ensureInstance();
    const connectionString = await connection.getConnectionString();
    await connect(connectionString);
    const userSchema = Schema.resolve(UserModel);
    const instance = model('user', userSchema);
    userModelMock = Mockeries.resolve(UserModel);
    await instance.insertMany(userModelMock);
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

    it('/user (POST)', async done => {
      return request(app.getHttpServer())
        .post('/user')
        .send(userModelMock)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(function(res) {
          return (
            res.body.forname === userModelMock[0].forname &&
            res.body.surname === userModelMock[0].surname &&
            res.body.email === userModelMock[0].email &&
            !res.body.password
          );
        })
        .then(() => {
          done();
        });
    });

    // it('/user (GET)', async () => {
    //   const expected = userModelMock.map((user: UserModel) => {
    //     const { password, ...rest } = user;
    //     return rest;
    //   });
    //   return request(app.getHttpServer())
    //     .get('/user')
    //     .set('Authorization', `Bearer ${auth.token}`)
    //     .expect(200)
    //     .expect(expected);
    // });
    //
    // it('/user?skip=3 (GET)', async () => {
    //   const all = db.get(DataMockEntities.USERS);
    //   const expected = all
    //     .map((user: UserModel) => {
    //       const { password, ...rest } = user;
    //       return rest;
    //     })
    //     .slice(3);
    //   return request(app.getHttpServer())
    //     .get('/user?skip=3')
    //     .set('Authorization', `Bearer ${auth.token}`)
    //     .expect(200)
    //     .expect(expected);
    // });
    //
    // it('/user/:id (GET)', () => {
    //   const all = db.get(DataMockEntities.USERS)[0];
    //   const { password, ...expected } = all;
    //   return request(app.getHttpServer())
    //     .get(`/user/${db.get(DataMockEntities.USERS)[0].id}`)
    //     .set('Authorization', `Bearer ${auth.token}`)
    //     .expect(200)
    //     .expect(expected);
    // });
  });

  // describe('access rights - none', () => {
  //   let auth: AuthSignInResponseDto;
  //
  //   beforeEach(async () => {
  //     auth = await request(app.getHttpServer())
  //       .post('/auth')
  //       .send(
  //         new AuthSignInRequestDto({
  //           email: 'tonda@zakaznik.cz',
  //           password: '12345',
  //         }),
  //       )
  //       .then(res => res.body);
  //   });
  //
  //   it('/user (POST)', () => {
  //     return request(app.getHttpServer())
  //       .post('/user')
  //       .send(userModelMock)
  //       .set('Authorization', `Bearer ${auth.token}`)
  //       .expect(403)
  //       .expect({
  //         error: 'Forbidden',
  //         message: 'Forbidden resource',
  //         statusCode: 403,
  //       });
  //   });
  //
  //   it('/user (GET)', async () => {
  //     const all = db.get(DataMockEntities.USERS);
  //     const expected = all.map((user: UserModel) => {
  //       const { password, ...rest } = user;
  //       return rest;
  //     });
  //     return request(app.getHttpServer())
  //       .get('/user')
  //       .set('Authorization', `Bearer ${auth.token}`)
  //       .expect(403)
  //       .expect({
  //         error: 'Forbidden',
  //         message: 'Forbidden resource',
  //         statusCode: 403,
  //       });
  //   });
  //
  //   it('/user?skip=3 (GET)', async () => {
  //     const all = db.get(DataMockEntities.USERS);
  //     const expected = all
  //       .map((user: UserModel) => {
  //         const { password, ...rest } = user;
  //         return rest;
  //       })
  //       .slice(3);
  //     return request(app.getHttpServer())
  //       .get('/user?skip=3')
  //       .set('Authorization', `Bearer ${auth.token}`)
  //       .expect(403)
  //       .expect({
  //         error: 'Forbidden',
  //         message: 'Forbidden resource',
  //         statusCode: 403,
  //       });
  //   });
  //
  //   it('/user/:id (GET)', () => {
  //     const all = db.get(DataMockEntities.USERS)[0];
  //     const { password, ...expected } = all;
  //     return request(app.getHttpServer())
  //       .get(`/user/${db.get(DataMockEntities.USERS)[0].id}`)
  //       .set('Authorization', `Bearer ${auth.token}`)
  //       .expect(403)
  //       .expect({
  //         error: 'Forbidden',
  //         message: 'Forbidden resource',
  //         statusCode: 403,
  //       });
  //   });
  // });
});
