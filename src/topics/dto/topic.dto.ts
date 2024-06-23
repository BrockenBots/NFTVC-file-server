import { Prisma } from '@prisma/client';

export class TopicDto implements Prisma.TopicCreateInput {
  id: number;
  name: string;
  category: 'Основная' | 'Знакомства' | 'Учеба';
  room: string;
  usersCount: number;
  users?: Prisma.UserCreateNestedManyWithoutTopicsInput;
  messagesCount: number;
}

export const topicsCategories = ['Основная', 'Знакомства', 'Учеба'];
