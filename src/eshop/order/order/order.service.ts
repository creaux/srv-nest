import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderSchema } from '@pyxismedia/lib-model';
import { Model, Types } from 'mongoose';
import { OrderResponse } from '../dto/order-response.dto';
import { CreateOrderRequest } from '../dto/create-order-request.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ORDER_MODEL) private readonly orderModel: Model<OrderSchema>,
  ) {}

  public async findAll(skip: number): Promise<OrderResponse[]> {
    return await this.orderModel
      .find()
      .sort('createdAt')
      .skip(skip)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(documents =>
        documents.map(document => new OrderResponse(document.toObject())),
      );
  }

  public async findById(id: string): Promise<OrderResponse> {
    return await this.orderModel
      .findById(id)
      .populate('user', '-password')
      .populate('products')
      .exec()
      .then(document => new OrderResponse(document.toObject()));
  }

  public async findByUserSomeId(
    userId: string,
    id: string,
  ): Promise<OrderResponse> {
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
            return new OrderResponse(data);
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
  ): Promise<OrderResponse[]> {
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
            return new OrderResponse(data);
          }
        });
      });
  }

  public async create(
    createOrderRequest: CreateOrderRequest,
  ): Promise<OrderResponse> {
    return await this.orderModel
      .create({
        _id: Types.ObjectId(),
        ...createOrderRequest,
      })
      .then(document => document.toObject());
  }
}
