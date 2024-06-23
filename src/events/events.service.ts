import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateEventDto) {
    return this.prisma.event.create({ data });
  }

  findAll() {
    return this.prisma.event.findMany({ orderBy: { id: 'desc' } });
  }

  findOne(id: number, userId?: number) {
    if (userId) {
      return this.prisma.event.findUnique({
        where: { id: id },
        include: {
          users: {
            where: { userId: userId },
          },
        },
      });
    } else {
      return this.prisma.event.findUnique({ where: { id: id } });
    }
  }

  update(id: number, data: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id: id },
      data: data,
    });
  }

  async addUser(eventId: number, userId: number) {
    const oldData = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        users: true,
      },
    });

    if (oldData.users.some((user) => user.userId === userId)) return oldData;

    await this.prisma.event.update({
      where: { id: eventId },
      data: { ready: oldData.users.length + 1 },
    });

    await this.prisma.eventUser.create({
      data: {
        eventId: eventId,
        userId: userId,
      },
    });

    return await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        users: true,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.eventUser.deleteMany({
      where: { eventId: id },
    });
    const delE = await this.prisma.event.delete({ where: { id: id } });
    return delE;
  }
}
