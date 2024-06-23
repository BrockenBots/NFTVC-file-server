import { Prisma } from '@prisma/client';
import { AdDto } from './ad.dto';

export class CreateAdDto implements Omit<AdDto, 'id'> {
  name: string;
  description: string;
  photos?: string[] | Prisma.AdCreatephotosInput;
  createdAt?: string | Date;
  contactData: string;
  category: string;
  room: string;
}
