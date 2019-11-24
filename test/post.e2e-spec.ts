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
    describe('/post (GET)', () => {
      it('should be possible to get all posts', async () => {
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

      it('should respond with Bad Request', async () => {
        return request(app.getHttpServer())
          .get('/post?skip=abc')
          .expect(400)
          .expect({
            statusCode: 400,
            error: 'Bad Request',
            message: 'You have to provide numeric value.',
          });
      });

      it('should be possible to skip posts', async () => {
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
    });

    describe('/post/:id (GET)', () => {
      it('should be possible to get post', () => {
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

    describe('/post (POST)', () => {
      it('should be possible to create post', done => {
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

      it("should respond with Bad Request when whole object is incorrect", () => {
        return request(app.getHttpServer())
          .post('/post')
          .send({ abc: 'abc'})
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            "statusCode": 400,
            "error": "Request validation failed",
            "message": [
              {
                "target": {
                  "abc": "abc"
                },
                "property": "title",
                "children": [],
                "constraints": {
                  "isDefined": "title should not be null or undefined",
                  "length": "title must be longer than or equal to 1 characters",
                  "isString": "title must be a string"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "subtitle",
                "children": [],
                "constraints": {
                  "isDefined": "subtitle should not be null or undefined",
                  "length": "subtitle must be longer than or equal to 1 characters",
                  "isString": "subtitle must be a string"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "content",
                "children": [],
                "constraints": {
                  "isDefined": "content should not be null or undefined",
                  "length": "content must be longer than or equal to 1 characters",
                  "isString": "content must be a string"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "image",
                "children": [],
                "constraints": {
                  "isDefined": "image should not be null or undefined",
                  "isUrl": "image must be an URL address"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "state",
                "children": [],
                "constraints": {
                  "isDefined": "state should not be null or undefined",
                  "isEnum": "state must be a valid enum value"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "labels",
                "children": [],
                "constraints": {
                  "isArray": "labels must be an array"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "createdBy",
                "children": [],
                "constraints": {
                  "isDefined": "createdBy should not be null or undefined",
                  "isMongoId": "createdBy must be a mongodb id"
                }
              },
              {
                "target": {
                  "abc": "abc"
                },
                "property": "section",
                "children": [],
                "constraints": {
                  "isMongoId": "section must be a mongodb id"
                }
              }
            ]
          });
      });

      describe('title error', () => {
        it("should respond with error when it is undefined", (done) => {
          const { title, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('title');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual('title should not be null or undefined');
              expect(body.message[0].constraints.isString).toEqual('title must be a string');
              expect(body.message[0].constraints.length).toEqual('title must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is not string", (done) => {
          const { title, ...post } = CreatePostModel.MOCK;
          const send = { ...post, title: 123 };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(123);
              expect(body.message[0].property).toEqual('title');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('title must be longer than or equal to 1 and shorter than or equal to 120 characters');
              expect(body.message[0].constraints.isString).toEqual('title must be a string');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is empty", (done) => {
          const { title, ...post } = CreatePostModel.MOCK;
          return request(app.getHttpServer())
            .post('/post')
            .send({ ...post, title: '' })
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('');
              expect(body.message[0].property).toEqual('title');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('title must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe('subtitle error', () => {
        it("should respond with error when it is undefined", (done) => {
          const { subtitle, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('subtitle');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual('subtitle should not be null or undefined');
              expect(body.message[0].constraints.isString).toEqual('subtitle must be a string');
              expect(body.message[0].constraints.length).toEqual('subtitle must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is not string", (done) => {
          const { subtitle, ...post } = CreatePostModel.MOCK;
          const send = { ...post, subtitle: 123 };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(123);
              expect(body.message[0].property).toEqual('subtitle');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('subtitle must be longer than or equal to 1 and shorter than or equal to 360 characters');
              expect(body.message[0].constraints.isString).toEqual('subtitle must be a string');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is empty", (done) => {
          const { subtitle, ...post } = CreatePostModel.MOCK;
          return request(app.getHttpServer())
            .post('/post')
            .send({ ...post, subtitle: '' })
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('');
              expect(body.message[0].property).toEqual('subtitle');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('subtitle must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe('content error', () => {
        it("should respond with error when it is undefined", (done) => {
          const { content, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('content');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual('content should not be null or undefined');
              expect(body.message[0].constraints.isString).toEqual('content must be a string');
              expect(body.message[0].constraints.length).toEqual('content must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is not string", (done) => {
          const { content, ...post } = CreatePostModel.MOCK;
          const send = { ...post, content: 123 };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(123);
              expect(body.message[0].property).toEqual('content');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('content must be longer than or equal to 1 and shorter than or equal to undefined characters');
              expect(body.message[0].constraints.isString).toEqual('content must be a string');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is empty", (done) => {
          const { content, ...post } = CreatePostModel.MOCK;
          return request(app.getHttpServer())
            .post('/post')
            .send({ ...post, content: '' })
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('');
              expect(body.message[0].property).toEqual('content');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual('content must be longer than or equal to 1 characters');
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe('url error', () => {
        it("should respond with error when it is undefined", (done) => {
          const { image, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('image');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isUrl).toEqual('image must be an URL address');
              expect(body.message[0].constraints.isDefined).toEqual('image should not be null or undefined');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is not url", (done) => {
          const { image, ...post } = CreatePostModel.MOCK;
          const send = { ...post, image: 'abc' };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('abc');
              expect(body.message[0].property).toEqual('image');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isUrl).toEqual('image must be an URL address');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });
      });

      describe('state error', () => {
        it("should respond with error when it is undefined", (done) => {
          const { state, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('state');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual('state should not be null or undefined');
              expect(body.message[0].constraints.isEnum).toEqual('state must be a valid enum value');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should respond with error when it is not enum", (done) => {
          const { state, ...post } = CreatePostModel.MOCK;
          const send = { ...post, state: 'abc' };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('abc');
              expect(body.message[0].property).toEqual('state');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isEnum).toEqual('state must be a valid enum value');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });
      });

      describe('labels error', () => {
        it("should be array", (done) => {
          const { labels, ...post } = CreatePostModel.MOCK;
          const send = { ...post, labels: 'abc' };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('abc');
              expect(body.message[0].property).toEqual('labels');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isArray).toEqual('labels must be an array');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should be array of strings", (done) => {
          const { labels, ...post } = CreatePostModel.MOCK;
          const send = { ...post, labels: [123, 456] };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual([123, 456]);
              expect(body.message[0].property).toEqual('labels');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isString).toEqual('each value in labels must be a string');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });
      });

      describe('createdBy errors', () => {
        it("should be defined", (done) => {
          const { createdBy, ...post } = CreatePostModel.MOCK;
          const send = { ...post };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual('createdBy');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual('createdBy should not be null or undefined');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it("should be mongo object id", (done) => {
          const { createdBy, ...post } = CreatePostModel.MOCK;
          const send = { ...post, createdBy: '123' };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('123');
              expect(body.message[0].property).toEqual('createdBy');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isMongoId).toEqual('createdBy must be a mongodb id');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it('should link to user which exists', () => {
          // TODO
          expect(true).toEqual(true);
        });
      });

      describe('section errors', () => {
        it("should be mongo object id", (done) => {
          const { section, ...post } = CreatePostModel.MOCK;
          const send = { ...post, section: '123' };
          return request(app.getHttpServer())
            .post('/post')
            .send(send)
            .set('Authorization', `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body } ) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual('Request validation failed');
              expect(body.message[0].value).toEqual('123');
              expect(body.message[0].property).toEqual('section');
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isMongoId).toEqual('section must be a mongodb id');
              expect(body.message[1]).toBeUndefined();
              done()
            });
        });

        it('should link to section which exists', () => {
          // TODO
          expect(true).toEqual(true);
        });
      });
    });

    describe('/post (DELETE)', () => {
      it('should be possible to delete post', done => {
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

      it('should respond with error message when incorrect object id is provided', async () => {
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

      it('should respond with Not Found', async () => {
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

    describe('/post (POST)', () => {
      it('should respond with Forbidden', async () => {
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
    });

    describe('/post (DELETE)', () => {
      it('should respond with Forbidden', async () => {
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
});
