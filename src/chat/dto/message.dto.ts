import { Prisma } from '@prisma/client';

export class Message implements Prisma.MessageCreateInput {
  id: number;
  room: Prisma.RoomCreateNestedOneWithoutMessagesInput;
  text: string;
  userId: number;
  userName: string;
  createdAt?: string | Date;
  roomId: string;
}

export class CreateMessage implements Omit<Message, 'room' | 'id'> {
  text: string;
  userId: number;
  userName: string;
  roomId: string;
}
