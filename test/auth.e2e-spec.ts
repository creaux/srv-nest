import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthSignInRequestDto } from '../src/auth/auth/auth-sign-in-request.dto';
import { MemoryDb, Entities } from './memory-db';
import { ConfigService } from '../src/config/config.module';
import { ConfigModule } from '../src/config/config.module';

describe('AuthController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(Entities.SECTIONS);
    db.import(Entities.POSTS);
    db.import(Entities.USERS);
    dbUri = await db.uri;
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, ConfigModule],
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

  it('/auth (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth')
      .send(
        new AuthSignInRequestDto({
          email: 'karel@vomacka.cz',
          password: '12345',
        }),
      )
      .expect(201)
      .expect(function(res: any) {
        res.body.token.match(/\d/);
        res.body.userId.match(/\d/);
        res.body.createdAt.match(/\d/);
        res.body.id.match(/\d/);
      });
  });
});
