import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PRODUCT_MODEL,
  ProductSchema,
  ExposeGroup,
} from '@pyxismedia/lib-model';
import { ProductResponseDto, CreateProductRequestDto } from './dto';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(PRODUCT_MODEL)
    private readonly productModel: Model<ProductSchema>,
  ) {}

  public getAll(skip: number = 0): Promise<ProductResponseDto[]> {
    return this.productModel
      .find()
      .sort('title')
      .skip(skip)
      .exec()
      .then(documents =>
        documents.map(document =>
          plainToClass(ProductResponseDto, document.toObject()),
        ),
      );
  }

  public async create(createProductRequestDto: CreateProductRequestDto) {
    const plain = classToPlain(createProductRequestDto);
    const product = {
      _id: Types.ObjectId(),
      ...plain,
    };
    return await this.productModel
      .create(product)
      .then(document => plainToClass(ProductResponseDto, document.toObject()));
  }

  public async getProductById(
    id: string,
  ): Promise<ProductResponseDto | NotFoundException> {
    return await this.productModel
      .findById(id)
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(ProductResponseDto, document.toObject());
        }
        throw new NotFoundException(
          'There is no product exists with requested id.',
        );
      });
  }

  public delete(id: string): Promise<ProductResponseDto | NotFoundException> {
    return this.productModel
      .findByIdAndRemove(id)
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(ProductResponseDto, document.toObject());
        }
        throw new NotFoundException(
          `There no product exists with requested id: ${id}`,
        );
      });
  }
}
