import { Prisma } from '@prisma/client';

export class AdDto implements Prisma.AdCreateInput {
  id: number;
  name: string;
  description: string;
  photos?: string[] | Prisma.AdCreatephotosInput;
  createdAt?: string | Date;
  contactData: string;
  category: string;
  room: string;
}
