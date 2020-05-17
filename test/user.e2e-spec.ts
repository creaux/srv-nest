import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigService } from '../src/config/config.service';
import { AuthSignInResponseDto } from '../src/auth/auth/dto/auth-sign-in-response.dto';
import {
  AuthSignInBuilder,
  CreateAccessModel,
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
import { UsersModule } from '../src/users/users.module';

describe('UsersController (e2e)', () => {
  let app: any;
  let mockeries: Mockeries;
  let fiber: Fiber;
  let dbUri: string;
  let user: UserModel[];

  beforeAll(async () => {
    mockeries = Injector.resolve<Mockeries>(Mockeries);
    fiber = Injector.resolve<Fiber>(Fiber);
    mockeries.prepare(L10nModel);
    await fiber.createFromModel(CreateRoleModel, 2);
    await fiber.createFromModel(CreateAccessModel);
    await fiber.createFromModel(CreateUserModel, 2);
    user = mockeries.resolve<UserModel[]>(UserModel);
    dbUri = await fiber.dbUri;
  });

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
    await fiber.tearDown();
  });

  describe('access rights - any', () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post('/auth')
        .send(
          new AuthSignInBuilder()
            .withEmail(user[0].email)
            .withPassword(user[0].password)
            .build(),
        )
        .then(res => res.body);
    });

    it('/user (POST)', async done => {
      return request(app.getHttpServer())
        .post('/user')
        .send(user)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(function(res) {
          return (
            res.body.forname === user[0].forname &&
            res.body.surname === user[0].surname &&
            res.body.email === user[0].email &&
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
