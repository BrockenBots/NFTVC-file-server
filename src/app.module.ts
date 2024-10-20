import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      dest: join(process.cwd() + 'uploads'),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
