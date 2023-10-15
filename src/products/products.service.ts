import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './../prisma/prisma.service';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prisma.product.findMany({ where: { published: true } });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id: id } });
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }
  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }
  findDrafts() {
    return this.prisma.product.findMany({ where: { published: false } });
  }
  remove(id: string) {
    return this.prisma.product.delete({ where: { id: id } });
  }
  
}
