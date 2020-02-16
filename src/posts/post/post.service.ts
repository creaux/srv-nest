import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostRequestDto } from './dto/create-post-request.dto';
import { PostSchemaInterface, ROLE_MODEL } from '@pyxismedia/lib-model';
import { PostResponseDto } from './dto/post-response.dto';
import { UserService } from '../../users/user/user.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    @InjectModel('Post') private readonly postModel: Model<PostSchemaInterface>,
  ) {}

  async create(createPostDto: CreatePostRequestDto): Promise<PostResponseDto> {
    const post = {
      _id: Types.ObjectId(),
      ...createPostDto,
    };
    await this.postModel.create(post);
    return this.postModel
      .findById(post._id.toHexString())
      .populate('section')
      .populate({
        path: 'createdBy',
        populate: {
          path: 'roles',
          model: ROLE_MODEL,
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
          model: ROLE_MODEL,
        },
      })
      .then(document => plainToClass(PostResponseDto, document.toObject()));
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
          model: ROLE_MODEL,
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
          model: ROLE_MODEL,
        },
      })
      .exec()
      .then(documents => {
        return documents.map(document => {
          return plainToClass(PostResponseDto, document.toObject());
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
          model: ROLE_MODEL,
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
          model: ROLE_MODEL,
        },
      })
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(PostResponseDto, document.toObject());
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
          model: ROLE_MODEL,
        },
      })
      .populate({
        path: 'updatedBy',
        populate: {
          path: 'roles',
          model: ROLE_MODEL,
        },
      })
      .populate('section')
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(PostResponseDto, document.toObject());
        }
        throw new NotFoundException(
          'There is no posts exists with requested id.',
        );
      });
  }
}
