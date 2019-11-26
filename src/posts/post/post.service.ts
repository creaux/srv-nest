import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './create-post.dto';
import { PostSchemaInterface, PostModel } from '@pyxismedia/lib-model';
import { PostResponseDto } from './post-response.dto';
import { UserService } from '../../users/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('Post') private readonly postModel: Model<PostSchemaInterface>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostSchemaInterface> {
    const post = {
      _id: Types.ObjectId(),
      ...createPostDto,
    };
    return await this.postModel.create(post).then(document => {
      return document.toObject();
    });
  }

  async findAll(skip: number = 0): Promise<PostResponseDto[]> {
    return await this.postModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('section')
      .populate({
        path: 'createdBy',
        populate: {
          path: 'roles',
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
        },
      })
      .exec()
      .then(documents => {
        return documents.map(document => {
          return new PostResponseDto(document.toObject());
        });
      });
  }

  async findById(id: string): Promise<PostResponseDto> {
    return await this.postModel
      .findById(id)
      .populate('section')
      .populate({
        path: 'createdBy',
        populate: {
          path: 'roles',
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
        },
      })
      .exec()
      .then(document => {
        if (document) {
          return new PostResponseDto(document.toObject());
        }
        throw new NotFoundException(
          'There is no posts exists with requested id.',
        );
      });
  }

  async delete(id: string): Promise<PostResponseDto> {
    return await this.postModel
      .findByIdAndRemove(id)
      .populate({
        path: 'createdBy',
        populate: {
          path: 'roles',
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
        },
      })
      .exec()
      .then(document => {
        if (document) {
          return new PostResponseDto(document.toObject());
        }
        throw new NotFoundException(
          'There is no posts exists with requested id.',
        );
      });
  }
}
