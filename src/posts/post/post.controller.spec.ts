import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { LoggerService } from '../../logger/logger.service';
import { PostModel, PostSchemaInterface } from '@pyxismedia/lib-model';
import { CreatePostDto } from './create-post.dto';
import { ROLES_BUILDER_TOKEN } from 'nest-access-control/lib';
import { AuthService } from '../../auth/auth/auth.service';
import { UserService } from '../../users/user/user.service';
import { Reflector } from '@nestjs/core';
import { RoleService } from '../../users/role/role.service';

describe('Post Controller', () => {
  let controller: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            findAll() {},
            findById() {},
            create() {},
            delete() {},
          },
        },
        { provide: LoggerInterceptor, useValue: {} },
        { provide: LoggerService, useValue: {} },
        { provide: ROLES_BUILDER_TOKEN, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: Reflector, useValue: {} },
        { provide: RoleService, useValue: {} },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be possible to get collection of posts', async () => {
    const spy = jest
      .spyOn(postService, 'findAll')
      .mockImplementation(() => Promise.resolve([PostModel.MOCK]));
    expect(await controller.findAll('0')).toEqual([PostModel.MOCK]);
    expect(spy).toHaveBeenCalledWith(0);
  });

  it('should be possible get post by id', async () => {
    const spy = jest
      .spyOn(postService, 'findById')
      .mockImplementation(() => Promise.resolve(PostModel.MOCK));
    expect(await controller.findById('a')).toEqual(PostModel.MOCK);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('should create post', async () => {
    const spy = jest
      .spyOn(postService, 'create')
      .mockImplementation(() =>
        Promise.resolve((PostModel.MOCK as unknown) as PostSchemaInterface),
      );
    expect(
      // FIXME: Why as CreatePostDto
      await controller.createPost((PostModel.MOCK as unknown) as CreatePostDto),
    ).toEqual(PostModel.MOCK);
    expect(spy).toHaveBeenCalledWith(PostModel.MOCK);
  });

  // it('should delete post', async () => {
  //   const spy = jest
  //     .spyOn(postService, 'delete')
  //     // TODO: Make sure that deleted post is not returned
  //     .mockImplementation(() => Promise.resolve('a'));
  //   expect(
  //     // FIXME: Why as CreatePostDto
  //     await controller.deletePost('a'),
  //   ).toEqual(undefined);
  //   expect(spy).toHaveBeenCalledWith('a');
  // });
});
