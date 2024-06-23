import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRequest } from 'src/auth/dto/auth.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('photo')
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: UserRequest,
  ): Promise<UserDto> {
    const user: UserDto = req.user;
    const oldData = await this.usersService.findOne(user['sub']);
    if (oldData.profileImage) {
      fs.unlink(
        join(process.cwd() + '/uploads/profileimages/' + oldData.profileImage),
        (err) => console.log(err),
      );
    }

    return this.usersService.update(user['sub'], {
      profileImage: file.filename,
    });
  }

  @Get('photo:imageName')
  // @UseGuards(AccessGuard)
  async downloadFile(
    @Param('imageName') imageName: string,
    @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    return res.sendFile(
      join(
        process.cwd() + '/uploads/profileimages/' + imageName.replace(':', ''),
      ),
    );
  }

  @Post()
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(AccessGuard)
  findOne(@Req() req: UserRequest) {
    return this.usersService.findOne(req.user['sub']);
  }

  @Patch('')
  @UseGuards(AccessGuard)
  update(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user['sub'], updateUserDto['data']);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
