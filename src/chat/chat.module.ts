import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { TopicsService } from 'src/topics/topics.service';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    PrismaService,
    UsersService,
    TopicsService,
  ],
})
export class ChatModule {}
