import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { PostMongo } from './post.types';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<PostMongo>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostMongo> {
    const post = {
      _id: Types.ObjectId(),
      ...createPostDto,
    };
    const createdPost = new this.postModel(post);
    return await createdPost.save();
  }

  async findAll(skip: number = 0): Promise<PostMongo[]> {
    return await this.postModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('section')
      .exec();
  }

  async findById(id: string): Promise<PostMongo> {
    return await this.postModel
      .findById(id)
      .populate('section')
      .exec();
  }
}
