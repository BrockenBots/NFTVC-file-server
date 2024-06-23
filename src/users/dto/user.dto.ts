import { Prisma } from '@prisma/client';

export class UserDto implements Prisma.UserCreateInput {
  id: number;
  password: string;
  fio: string;
  email: string;
  city: string;
  community: string;
  room?: number;
  refresh: string;
  profileImage?: string;
}
