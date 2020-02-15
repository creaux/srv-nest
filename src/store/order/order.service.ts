import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderSchema, OrderProcess } from '@pyxismedia/lib-model';
import { Model, Types } from 'mongoose';
import {
  OrderResponseDto,
  UpdateOrderRequestDto,
  CreateOrderRequestDto,
} from './dto';
import { UserService } from '../../users/user/user.service';
import { ProductService } from '../product/product.service';
import { PaymentService } from '../payment/payment.service';
import { classToPlain, plainToClass } from 'class-transformer';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ORDER_MODEL) private readonly orderModel: Model<OrderSchema>,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
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
        // TODO plainToClass to ensure prices with tax etc
        documents.map(document => new OrderResponseDto(document.toObject())),
      );
  }

  public async findById(id: string): Promise<OrderResponseDto> {
    return await this.orderModel
      .findById(id)
      .populate('user', '-password')
      .populate('products')
      .exec()
      // TODO serialize????!
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
    createOrderRequest: CreateOrderRequestDto,
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

    // TODO Calculate amount and provide correct currency
    // Price has to be calculated from products prices in certain currency
    // Currency has to be gathered from client on request on endpoint passed as parameter of this.create
    // Question is whether there should be some session of user and on the beginning of this session
    // these informations suppose to be cached (althought this could be implemented later as feature)
    // ------!!!!! ->
    // or even better it should be saved in database with user informations - this assumes to be registered before
    // ordering even so currency could be saved based on browser setting and changed later manually
    // ----- changed later it should not happen as different markets could have different prices!!!!!!!!!!!!! so ti should be locked
    // const paymentSecret = await this.paymentService.getPaymentSecret(
    //   123,
    //   'usd',
    // );

    const id = Types.ObjectId();
    const plain = classToPlain(createOrderRequest);
    await this.orderModel.create(
      Object.assign(
        {
          _id: id,
          // paymentId: paymentSecret.id,
        },
        plain,
      ),
    );

    return await this.findById(id.toHexString());
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
    if (body.products == undefined && body.user == undefined) {
      throw new BadRequestException(
        'At least one existing user or one of existing products should be provided',
      );
    }

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
    await this.orderModel.findByIdAndUpdate(id, { $set: body }, { new: true });

    return this.findById(id);
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

  public findOrderByIdAndMarkAsPaid(
    orderId: string,
  ): Promise<OrderResponseDto> {
    return this.orderModel
      .findByIdAndUpdate(
        orderId,
        {
          $set: { process: OrderProcess.PAID },
        },
        { new: true },
      )
      .populate('products')
      .populate('users', '-password')
      .exec()
      .then(document => {
        if (document) {
          return plainToClass(OrderResponseDto, document.toObject());
        }
        throw new NotFoundException(
          `Order with requested id ${orderId} doesn't exist.`,
        );
      });
  }
}
