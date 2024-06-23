import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { AdsModule } from './ads/ads.module';
import { ChatModule } from './chat/chat.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [
    MulterModule.register({
      dest: join(process.cwd() + 'uploads'),
    }),
    AuthModule,
    UsersModule,
    EventsModule,
    AdsModule,
    ChatModule,
    TopicsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
