import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';

@Injectable()
export class BuyerService {
  constructor(private prisma: PrismaService) {}

  async create(createBuyerDto: CreateBuyerDto) {
    return this.prisma.buyer.create({
      data: { userId: createBuyerDto.userId },
      include: { user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.buyer.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.buyer.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.buyer.findMany({
      include: { user: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.buyer.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async remove(id: string) {
    return this.prisma.buyer.delete({
      where: { id },
      include: { user: true },
    });
  }
}
