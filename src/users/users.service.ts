import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id: id } });
  }

  async findAll(): Promise<UserDto[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);
    data.password = hashedPassword;
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<UserDto> {
    if (data.password)
      data.password = await bcrypt.hash(data.password, roundsOfHashing);
    if (data.refresh)
      data.refresh = await bcrypt.hash(data.refresh, roundsOfHashing);
    return this.prisma.user.update({
      where: { id: id },
      data,
    });
  }
}
