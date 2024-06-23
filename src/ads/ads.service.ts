import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class AdsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chat: ChatService,
  ) {}
  async create(createAdDto: CreateAdDto) {
    createAdDto.room = uuidv4();
    await this.chat.createRoom(createAdDto.room);
    return await this.prisma.ad.create({ data: createAdDto });
  }

  findAll() {
    return this.prisma.ad.findMany();
  }

  findAllByCategory(category: string) {
    return this.prisma.ad.findMany({ where: { category } });
  }

  findOne(id: number) {
    return this.prisma.ad.findUnique({ where: { id } });
  }

  update(id: number, updateAdDto: UpdateAdDto) {
    return this.prisma.ad.update({ where: { id }, data: updateAdDto });
  }

  remove(id: number) {
    return `This action removes a #${id} ad`;
  }
}
