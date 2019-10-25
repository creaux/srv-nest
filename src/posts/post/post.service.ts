import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './create-post.dto';
import { PostSchemaInterface, PostModel } from '@pyxismedia/lib-model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostSchemaInterface>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostModel> {
    const post = {
      _id: Types.ObjectId(),
      ...createPostDto,
    };
    const createdPost = new this.postModel(post);
    return await createdPost.save();
  }

  async findAll(skip: number = 0): Promise<PostModel[]> {
    return await this.postModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('section')
      .exec();
  }

  async findById(id: string): Promise<PostModel> {
    return await this.postModel
      .findById(id)
      .populate('section')
      .exec();
  }

  async delete(id: string) {
    return await this.postModel.findByIdAndRemove(id);
  }
}
