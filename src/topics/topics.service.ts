import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { topicsCategories } from './dto/topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chat: ChatService,
  ) {}
  async create(createTopicDto: CreateTopicDto) {
    const topic = await this.prisma.topic.create({ data: createTopicDto });
    await this.chat.createRoom(topic.room);
    return topic;
  }

  async findAll() {
    const iter = topicsCategories.map(async (category) => {
      const topics = await this.prisma.topic.findMany({
        where: { category: category },
      });
      return await {
        category: category,
        topics: topics,
      };
    });
    let res = [];
    await Promise.all(iter).then((values) => {
      res = values;
    });

    return res;
  }

  findOne(id: number) {
    return this.prisma.topic.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            fio: true,
          },
        },
      },
    });
  }

  async findOneByRoom(roomId: string) {
    const res = await this.prisma.topic.findMany({
      where: { room: roomId },
      include: {
        users: {
          select: {
            id: true,
            fio: true,
          },
        },
      },
    });
    return res[0];
  }

  async changeCount(id: number, sign: string, userId: number) {
    const change = sign === '+' ? { increment: 1 } : { decrement: 1 };
    if (sign === '-') {
      await this.prisma.topic.update({
        where: { id: id },
        include: { users: true },
        data: {
          users: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } else {
      await this.prisma.topic.update({
        where: { id: id },
        data: {
          users: { connect: { id: userId } },
        },
      });
    }
    return await this.prisma.topic.update({
      data: {
        usersCount: change,
      },
      where: { id: id },
    });
  }

  async increaseMessages(room: string) {
    return await this.prisma.topic.updateMany({
      where: { room: room },
      data: {
        messagesCount: { increment: 1 },
      },
    });
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return this.prisma.topic.update({
      where: { id: id },
      data: updateTopicDto,
    });
  }

  remove(id: number) {
    return this.prisma.topic.delete({ where: { id: id } });
  }
}
