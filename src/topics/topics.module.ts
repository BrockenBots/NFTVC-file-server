import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicController, TopicsController } from './topics.controller';
import { PrismaService } from 'src/prisma.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [TopicsController, TopicController],
  providers: [TopicsService, PrismaService, ChatService],
})
export class TopicsModule {}
