import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderSchema } from '@pyxismedia/lib-model';
import { Model, Types } from 'mongoose';
import {
  OrderResponseDto,
  CreateOrderUserDto,
  UpdateOrderRequestDto,
} from './dto';
import { UserService } from '../../users/user/user.service';
import { ProductService } from '../product/product.service';
import { applyAuthChecker } from 'type-graphql/dist/resolvers/helpers';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ORDER_MODEL) private readonly orderModel: Model<OrderSchema>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  public async findAll(skip: number): Promise<OrderResponseDto[]> {
    return await this.orderModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(documents =>
        documents.map(document => new OrderResponseDto(document.toObject())),
      );
  }

  public async findById(id: string): Promise<OrderResponseDto> {
    return await this.orderModel
      .findById(id)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => new OrderResponseDto(document.toObject()));
  }

  public async findByUserSomeId(
    userId: string,
    id: string,
  ): Promise<OrderResponseDto> {
    return await this.orderModel
      .findById(id)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => {
        // TODO: Is that possible to do filter directly in query? Seems not
        if (document) {
          const data = document.toObject();
          if (data.user.id === userId) {
            return new OrderResponseDto(data);
          }
        }
        throw new NotFoundException(
          `Order with userId of ${userId} and id of ${id} doesn't exist.`,
        );
      });
  }

  public async findAllByUserId(
    userId: string,
    skip: number = 0,
  ): Promise<OrderResponseDto[]> {
    // TODO: How the hell do the search on mongodb?
    // find({ user: userId }) doesn't work and similar either
    return await this.orderModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(documents => {
        return documents.filter(document => {
          const data = document.toObject();
          if (data.user.id === userId) {
            return new OrderResponseDto(data);
          }
        });
      });
  }

  public async create(
    createOrderRequest: CreateOrderUserDto,
  ): Promise<OrderResponseDto> {
    if (createOrderRequest.products && createOrderRequest.products.length > 0) {
      // If any product doesn't exist it throws exception
      for (const productId of createOrderRequest.products) {
        try {
          await this.productService.getProductById(productId);
        } catch (e) {
          throw e;
        }
      }
    }

    const id = Types.ObjectId();
    await this.orderModel.create({
      _id: id,
      ...createOrderRequest,
    });

    return this.findById(id.toHexString());
  }

  public async deleteById(id: string): Promise<OrderResponseDto> {
    return await this.orderModel
      .findByIdAndDelete(id)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => document.toObject());
  }

  /**
   * Update particular data on order depending on data which are provided
   * @param id
   * @param body
   */
  public async updateById(
    id: string,
    body: UpdateOrderRequestDto,
  ): Promise<OrderResponseDto> {
    if (body.user) {
      // If user doesn't exist it throws exception
      try {
        await this.userService.findById(body.user);
      } catch (e) {
        throw e;
      }
    }

    if (body.products && body.products.length > 0) {
      // If any product doesn't exist it throws exception
      for (const productId of body.products) {
        try {
          await this.productService.getProductById(productId);
        } catch (e) {
          throw e;
        }
      }
    }

    // TODO: Check whether provided products and users exists if not raise exceptions
    return await this.orderModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => {
        if (document) {
          // Populate has to be done after as findByIdAndUpdate().populate()
          // happens at the same time
          return document.toObject();
        }
        throw new NotFoundException(`Order of id ${id} doesn't exist.`);
      });
  }

  public async addProductToOrder(orderId: string, productId: string) {
    try {
      await this.productService.getProductById(productId);
    } catch (e) {
      throw e;
    }

    return await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { $push: { products: productId } },
        { new: true },
      )
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => {
        if (document) {
          return document.toObject();
        }
        throw new NotFoundException(
          `Order with requested id ${orderId} doesn't exists`,
        );
      });
  }

  public async removeProductFromOrder(orderId: string, productId: string) {
    try {
      await this.productService.getProductById(productId);
    } catch (e) {
      throw e;
    }

    return await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { $pull: { products: productId } },
        { new: true },
      )
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => {
        if (document) {
          return document.toObject();
        }
        throw new NotFoundException(
          `Order with requested id ${orderId} doesn't exists`,
        );
      });
  }
}
