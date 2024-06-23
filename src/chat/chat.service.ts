import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessage } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async createRoom(roomId: string) {
    return await this.prisma.room.create({
      data: {
        roomId: roomId,
      },
    });
  }

  async getMessagesByRoom(roomId: string) {
    const res = await this.prisma.room.findUnique({
      where: { roomId: roomId },
      select: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return res.messages;
  }

  async createMessage(data: CreateMessage) {
    return await this.prisma.message.create({
      data: data,
    });
  }
}
