//src/products/products.controller.ts
import { Prisma, Product } from '@prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ConnectionArgs } from 'src/page/connection-args.dto';
import { Page } from 'src/page/page.dto';
import { ApiPageResponse } from 'src/page/api-page-response.decorator';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
@Controller('products')
export class ProductsController {
  prisma: any;
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    return new ProductEntity(
      await this.productsService.create(createProductDto),
    );
  }

  @Get('page')
  @ApiPageResponse(ProductEntity)
  async findPage(connectionArgs: ConnectionArgs) {
    const where: Prisma.ProductWhereInput = {
      published: true,
     };
    return findManyCursorConnection(
      (args) =>
        this.prisma.product.findMany({
          ...args,
          where: where,
        }),
      () =>
        this.prisma.product.count({
          where: where,
        }),
      connectionArgs,
      {
        recordToEdge: (record) => ({
          node: new ProductEntity(record), // 👈 instance to transform price
        }),
      },
    );
    
    return new Page<ProductEntity>(productPage); // 👈 instance as this object is returned
  }

  @Get()
  @ApiOkResponse({ type: [ProductEntity] })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('drafts')
  @ApiOkResponse({ type: [ProductEntity] })
  async findDrafts() {
    const drafts = await this.productsService.findDrafts();
    return drafts.map((product) => new ProductEntity(product));
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ProductEntity })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return new ProductEntity(
      await this.productsService.update(id, updateProductDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.remove(id));
  }
}