import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PRODUCT_MODEL, ProductSchema } from '@pyxismedia/lib-model';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductRequestDto } from './dto/create-product-request.dto';

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
        documents.map(document => {
          return new ProductResponseDto(document.toObject());
        }),
      );
  }

  public async create(createProductRequestDto: CreateProductRequestDto) {
    const product = {
      _id: Types.ObjectId(),
      ...createProductRequestDto,
    };
    return await this.productModel.create(product).then(document => {
      return document.toObject();
    });
  }

  public async getProductById(
    id: string,
  ): Promise<ProductResponseDto | NotFoundException> {
    return await this.productModel
      .findById(id)
      .exec()
      .then(document => {
        if (document) {
          return new ProductResponseDto(document.toObject());
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
          return new ProductResponseDto(document.toObject());
        }
        throw new NotFoundException(
          `There no product exists with requested id: ${id}`,
        );
      });
  }
}
