import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdController, AdsController } from './ads.controller';
import { PrismaService } from 'src/prisma.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [AdsController, AdController],
  providers: [AdsService, PrismaService, ChatService],
})
export class AdsModule {}
