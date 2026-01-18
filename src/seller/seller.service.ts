import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellerService {
  constructor(private prismaService: PrismaService) {}

  async create(createSellerDto: CreateSellerDto) {
    return this.prismaService.seller.create({ data: { ...createSellerDto } });
  }

  async findAll() {
    return this.prismaService.seller.findMany();
  }

  async findOne(id: string) {
    return this.prismaService.seller.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return this.prismaService.seller.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prismaService.seller.delete({ where: { id } });
  }
}
