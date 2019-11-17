import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PostsModule } from '../src/posts/posts.module';
import { ConfigService } from '../src/config/config.service';
import {
  PostModel,
  DataMockEntities,
  CreatePostModel,
} from '@pyxismedia/lib-model';
import { AuthSignInRequestDto } from '../src/auth/auth/auth-sign-in-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { MemoryDb } from './memory-db';
import { AuthSignInResponseDto } from '../src/auth/auth/auth-sign-in-response.dto';

describe('PostController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.SECTIONS);
    db.import(DataMockEntities.POSTS);
    db.import(DataMockEntities.USERS);
    db.import(DataMockEntities.ROLES);
    db.import(DataMockEntities.ACCESS);
    dbUri = await db.uri;
    await db.ensure();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule, AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get() {
          return dbUri;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('with anonymous access', () => {
    it('/post (GET) should be possible to get all posts', async () => {
      return request(app.getHttpServer())
        .get('/post')
        .expect(200)
        .expect([
          {
            title: 'Lorem ipsum 1 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-1',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:05.000Z',
            updatedAt: '2019-06-23T14:13:05.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            section: { name: 'Section', id: '00000000000000000000000a' },
            id: '000000000000000000000a00',
          },
          {
            title: 'Lorem ipsum 2 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-2',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:06.000Z',
            updatedAt: '2019-06-23T14:13:06.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            section: { name: 'Section', id: '00000000000000000000000a' },
            id: '000000000000000000000b00',
          },
          {
            title: 'Lorem ipsum 3 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-3',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:07.000Z',
            updatedAt: '2019-06-23T14:13:07.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            section: { name: 'Section 2', id: '00000000000000000000000b' },
            id: '000000000000000000000c00',
          },
          {
            title: 'Lorem ipsum 4 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-4',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:08.000Z',
            updatedAt: '2019-06-23T14:13:08.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            section: { name: 'Section 2', id: '00000000000000000000000b' },
            id: '000000000000000000000d00',
          },
          {
            title: 'Lorem ipsum 5 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-1',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:09.000Z',
            updatedAt: '2019-06-23T14:13:09.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            section: { name: 'Section 2', id: '00000000000000000000000b' },
            id: '000000000000000000000e00',
          },
        ]);
    });

    it('/post (GET) should respond with Bad Request', async () => {
      return request(app.getHttpServer())
        .get('/post?skip=abc')
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'You have to provide numeric value.',
        });
    });

    it('/post?skip=3 (GET) should be possible to skip posts', async () => {
      return request(app.getHttpServer())
        .get('/post?skip=3')
        .expect(200)
        .expect([
          {
            title: 'Lorem ipsum 4 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-4',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:08.000Z',
            updatedAt: '2019-06-23T14:13:08.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
              forname: 'Frantisek',
              surname: 'Medvidek',
              email: 'frantisek@medvidek.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000b00',
            },
            section: { name: 'Section 2', id: '00000000000000000000000b' },
            id: '000000000000000000000d00',
          },
          {
            title: 'Lorem ipsum 5 en',
            subtitle: 'Dolor sit amet en',
            content: 'Integer posuere erat. en',
            state: 'DRAFT',
            slug: 'lorem-ipsum-1',
            labels: ['lorem-ipsum-1'],
            createdAt: '2019-06-23T14:13:09.000Z',
            updatedAt: '2019-06-23T14:13:09.000Z',
            image: 'someimage.png',
            createdBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            updatedBy: {
              roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
              forname: 'Karel',
              surname: 'Vomacka',
              email: 'karel@vomacka.cz',
              password:
                '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
              id: '000000000000000000000a00',
            },
            section: { name: 'Section 2', id: '00000000000000000000000b' },
            id: '000000000000000000000e00',
          },
        ]);
    });

    it('/post/:id (GET) should be possible to get post', () => {
      return request(app.getHttpServer())
        .get(`/post/${db.get(DataMockEntities.POSTS)[0].id}`)
        .expect(200)
        .expect({
          title: 'Lorem ipsum 1 en',
          subtitle: 'Dolor sit amet en',
          content: 'Integer posuere erat. en',
          state: 'DRAFT',
          slug: 'lorem-ipsum-1',
          labels: ['lorem-ipsum-1'],
          createdAt: '2019-06-23T14:13:05.000Z',
          updatedAt: '2019-06-23T14:13:05.000Z',
          image: 'someimage.png',
          createdBy: {
            roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
            forname: 'Karel',
            surname: 'Vomacka',
            email: 'karel@vomacka.cz',
            password:
              '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
            id: '000000000000000000000a00',
          },
          updatedBy: {
            roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
            forname: 'Frantisek',
            surname: 'Medvidek',
            email: 'frantisek@medvidek.cz',
            password:
              '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
            id: '000000000000000000000b00',
          },
          section: { name: 'Section', id: '00000000000000000000000a' },
          id: '000000000000000000000a00',
        });
    });

    it('/post/:id (GET) should respond with Bad Request', () => {
      return request(app.getHttpServer())
        .get(`/post/135`)
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Requested id is not ObjectId.',
        });
    });

    it('/post/:id (GET) should respond with Not Found', () => {
      return request(app.getHttpServer())
        .get(`/post/00000000000000000000000a`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'There is no posts exists with requested id.',
        });
    });
  });

  describe('with access rights', () => {
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

    it('/post (POST) should be possible to create post', done => {
      return request(app.getHttpServer())
        .post('/post')
        .send(CreatePostModel.MOCK)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(201)
        .end((err, { body }) => {
          // FIXME: This is not PostModel but PostSchemaInterface
          expect(body.title).toEqual(PostModel.MOCK.title);
          expect(body.subtitle).toEqual(PostModel.MOCK.subtitle);
          expect(body.content).toEqual(PostModel.MOCK.content);
          expect(body.state).toEqual(PostModel.MOCK.state);
          expect(body.labels).toEqual(PostModel.MOCK.labels);
          expect(body.image).toEqual(PostModel.MOCK.image);
          expect(body.createdBy).toEqual('507f1f77bcf86cd799439011');
          expect(body.section).toEqual(PostModel.MOCK.section);
          return done();
        });
    });

    it('/post (DELETE) should be possible to delete post', done => {
      return request(app.getHttpServer())
        .delete(`/post/000000000000000000000a00`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(200)
        .end((err, { body }) => {
          expect(body.title).toEqual('Lorem ipsum 1 en');
          expect(body.subtitle).toEqual('Dolor sit amet en');
          expect(body.content).toEqual('Integer posuere erat. en');
          expect(body.state).toEqual('DRAFT');
          expect(body.slug).toEqual('lorem-ipsum-1');
          expect(body.labels).toEqual(['lorem-ipsum-1']);
          expect(body.createdAt).toMatch(/\d+/);
          expect(body.updatedAt).toMatch(/\d+/);
          expect(body.image).toEqual('someimage.png');
          expect(body.createdBy).toEqual({
            email: 'karel@vomacka.cz',
            forname: 'Karel',
            id: '000000000000000000000a00',
            password:
              '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
            roles: [{ id: '5dc9bc0c99e35856ffe90e66', name: 'Superadmin' }],
            surname: 'Vomacka',
          });
          expect(body.updatedBy).toEqual({
            email: 'frantisek@medvidek.cz',
            forname: 'Frantisek',
            id: '000000000000000000000b00',
            password:
              '$2b$10$0JCol.4vgoaiy70z9XX8ZOyJHYV6PMidts.WToOrAZmj90wgbPIou',
            roles: [{ id: '5dc9bbffa68eed83b62d0e4c', name: 'Admin' }],
            surname: 'Medvidek',
          });
          expect(body.section).toEqual('00000000000000000000000a');
          expect(body.id).toEqual('000000000000000000000a00');
          done();
        });
    });

    it('/post (DELETE) should respond with error message when incorrect object id is provided', async () => {
      return await request(app.getHttpServer())
        .delete(`/post/12`)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Requested id is not ObjectId.',
        });
    });

    it('/post (DELETE) should respond with Not Found', async () => {
      return await request(app.getHttpServer())
        .delete('/post/00000000000000000000000a')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'There is no posts exists with requested id.',
        });
    });
  });

  describe('without access rights', () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post('/auth')
        .send(
          new AuthSignInRequestDto({
            email: 'frantisek@medvidek.cz',
            password: '12345',
          }),
        )
        .then(res => res.body);
    });

    it('/post (POST) should respond with Forbidden', async () => {
      return await request(app.getHttpServer())
        .post('/post')
        .send(CreatePostModel.MOCK)
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        });
    });

    it('/post (DELETE) should respond with Forbidden', async () => {
      return await request(app.getHttpServer())
        .delete('/post/000000000000000000000a00')
        .set('Authorization', `Bearer ${auth.token}`)
        .expect(403)
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Forbidden resource',
        });
    });
  });
});
