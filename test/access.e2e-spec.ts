import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { AuthSignInRequestDto } from '../src/auth/auth/dto/auth-sign-in-request.dto';
import { MemoryDb } from './memory-db';
import { ConfigService } from '../src/config/config.service';
import { ConfigModule } from '../src/config/config.module';
import { DataMockEntities } from '@pyxismedia/lib-model';
import { AuthSignInResponseDto } from '../src/auth/auth/dto/auth-sign-in-response.dto';
import { useContainer } from 'class-validator';

describe('AccessController (e2e)', () => {
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

  afterAll(async () => {
    await db.stop();
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

    useContainer(app, { fallbackOnErrors: true });
  });

  describe('unauthentized', () => {
    it('/access (GET)', async () => {
      return await request(app.getHttpServer())
        .get('/access')
        .expect(401)
        .expect({ statusCode: 401, error: 'Unauthorized' });
    });
  });

  describe('authentized', () => {
    let auth: AuthSignInResponseDto;

    describe('access rights - any', () => {
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

      it('/access (GET)', () => {
        return request(app.getHttpServer())
          .get('/access')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              action: 'read',
              attributes: ['*'],
              denied: false,
              id: '507f1f77bcf86cd799439012',
              possession: 'any',
              resource: ['post', 'order', 'access', 'user', 'role'],
              role: ['Superadmin'],
            },
            {
              action: 'create',
              attributes: ['*'],
              denied: false,
              id: '5dcc634a6a5a108f837936a4',
              possession: 'any',
              resource: ['post', 'order', 'access', 'user', 'role'],
              role: ['Superadmin'],
            },
            {
              action: 'update',
              attributes: ['*'],
              denied: false,
              id: '5dcc635008707c9ee0f66d53',
              possession: 'any',
              resource: ['post', 'order', 'access', 'user', 'role'],
              role: ['Superadmin'],
            },
            {
              action: 'delete',
              attributes: ['*'],
              denied: false,
              id: '5dcc6355ddd59453030e2732',
              possession: 'any',
              resource: ['post', 'order', 'access', 'user', 'role'],
              role: ['Superadmin'],
            },
            {
              action: 'read',
              attributes: ['*'],
              denied: false,
              id: '5dcc635cdd97ad374b8899c1',
              possession: 'any',
              resource: ['post'],
              role: ['Admin'],
            },
            {
              action: 'create',
              attributes: ['*'],
              denied: true,
              id: '5dcc636099120d698692a7f1',
              possession: 'any',
              resource: ['post'],
              role: ['Admin'],
            },
            {
              action: 'update',
              attributes: ['*'],
              denied: true,
              id: '5dcc63665f39664940ccdccb',
              possession: 'any',
              resource: ['post'],
              role: ['Admin'],
            },
            {
              action: 'delete',
              attributes: ['*'],
              denied: true,
              id: '5dcc636cc751851ba8aaee02',
              possession: 'any',
              resource: ['post'],
              role: ['Admin'],
            },
            {
              action: 'read',
              attributes: ['*'],
              denied: false,
              id: '5e021bb691e6b827f73731a3',
              possession: 'own',
              resource: ['order'],
              role: ['Customer'],
            },
            {
              action: 'create',
              attributes: ['*'],
              denied: false,
              id: '5e021bc45612659374f061b2',
              possession: 'own',
              resource: ['order'],
              role: ['Customer'],
            },
            {
              action: 'update',
              attributes: ['*'],
              denied: true,
              id: '5e021bca057c4b6c825771a5',
              possession: 'own',
              resource: ['order'],
              role: ['Customer'],
            },
            {
              action: 'delete',
              attributes: ['*'],
              denied: true,
              id: '5e021bd0d94fccf5f56e8aae',
              possession: 'own',
              resource: ['order'],
              role: ['Customer'],
            },
            {
              action: 'read',
              attributes: ['*'],
              denied: false,
              id: '5e18a614c8054f66e64c7125',
              possession: 'any',
              resource: ['post'],
              role: ['Anonymous'],
            },
            {
              action: 'read',
              attributes: ['*'],
              denied: false,
              id: '5e2dc5efb2be67c62fc19dc1',
              possession: 'own',
              resource: ['post'],
              role: ['Anonymous'],
            },
          ]);
      });
    });
  });
});
