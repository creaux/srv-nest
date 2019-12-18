import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipes/validation.pipe';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { ProductResponseDto } from './dto/ProductResponse.dto';
import { ParseNumberPipe } from '../../../pipes/parse-number.pipe';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductRequestDto } from './dto/create-product-request.dto';

@Controller('commerce/product')
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ title: 'Request product collection' })
  public getAll(@Query('skip', ParseNumberPipe) skip: number) {
    return this.productService.getAll(skip);
  }

  @Get(':id')
  @ApiOperation({ title: 'Get product by id' })
  @ApiResponse({
    status: 200,
    description: 'Product has been succesfully provided',
  })
  public async getProduct(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ProductResponseDto | NotFoundException> {
    return await this.productService.getProductById(id);
  }

  @Post()
  @ApiOperation({ title: 'Create product' })
  @ApiResponse({
    status: 201,
    description: 'Product has been successfully created.',
  })
  @UseGuards(AuthGuard('bearer'))
  public async createProduct(
    @Body(ValidationPipe)
    createProductModel: CreateProductRequestDto,
  ) {
    return await this.productService.create(createProductModel);
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete product' })
  @ApiResponse({
    status: 200,
    description: 'Product has been successfully deleted',
  })
  @UseGuards(AuthGuard('bearer'))
  public async deleteProduct(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.productService.delete(id);
  }
}
