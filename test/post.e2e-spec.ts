import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PostsModule } from '../src/posts/posts.module';
import { ConfigService } from '../src/config/config.module';
import { PostModel } from '@pyxismedia/lib-model';
import { AuthSignInRequestDto } from '../src/auth/auth/auth-sign-in-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { CreatePostModel } from '../../lib-model/src/post/create-post.model';
import { MemoryDb, Entities } from './memory-db';

describe('PostController (e2e)', () => {
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
      imports: [PostsModule, AuthModule],
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

  it('/post (GET)', async () => {
    return request(app.getHttpServer())
      .get('/post')
      .expect(200)
      .expect(db.get(Entities.POSTS));
  });

  it('/post?skip=3 (GET)', async () => {
    return request(app.getHttpServer())
      .get('/post?skip=3')
      .expect(200)
      .expect(db.get(Entities.POSTS).slice(3));
  });

  it('/post/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/post/${db.get(Entities.POSTS)[0].id}`)
      .expect(200)
      .expect(db.get(Entities.POSTS)[0]);
  });

  it('/post (POST)', async done => {
    const auth = await request(app.getHttpServer())
      .post('/auth')
      .send(new AuthSignInRequestDto('karel@vomacka.cz', '12345'))
      .then(res => {
        return res.body;
      });
    const {
      id,
      title,
      subtitle,
      content,
      image,
      state,
      labels,
      section,
      createdBy,
      updatedBy,
      updatedAt,
      createdAt,
    } = PostModel.MOCK;
    const response = new PostModel(
      title,
      subtitle,
      content,
      image,
      state,
      labels,
      createdBy,
      section,
      undefined,
      updatedBy,
      undefined,
      undefined,
    );
    return request(app.getHttpServer())
      .post('/post')
      .send(CreatePostModel.MOCK)
      .set('Authorization', `Bearer ${auth.token}`)
      .expect(function(res) {
        return (
          res.body.title === title &&
          res.body.subtitle === subtitle &&
          res.body.content === content &&
          res.body.image === image &&
          res.body.state === state &&
          res.body.labels === labels &&
          res.body.createdBy === createdBy &&
          res.body.section === section &&
          res.body.updatedBy === updatedBy &&
          res.body.createdAt.match(/\d/) &&
          res.body.updatedAt.match(/\d/)
        );
      })
      .then(() => {
        done();
      });
  });
});
