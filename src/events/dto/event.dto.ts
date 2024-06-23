import { Prisma } from '@prisma/client';

export class EventDto implements Prisma.EventCreateInput {
  name: string;
  description: string;
  date: string | Date;
  count?: number;
  ready: number;
  eventImage?: string;
  users?: Prisma.EventUserCreateNestedManyWithoutEventInput;
}
