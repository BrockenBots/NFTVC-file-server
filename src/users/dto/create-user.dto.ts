import { UserDto } from './user.dto';

export class CreateUserDto implements Omit<UserDto, 'id' | 'refresh'> {
  password: string;
  fio: string;
  email: string;
  city: string;
  community: string;
  room?: number;
}
