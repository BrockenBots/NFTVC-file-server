import {
  Controller,
  Get,
  Post,
  Param,
  // UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
// import { AccessGuard } from 'src/auth/guards/access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { Response } from 'express';
// import * as fs from 'fs';

export const storage = {
  storage: diskStorage({
    destination: './uploads/achievements',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('api/achievements')
export class UsersController {
  constructor() {}

  @Post('file')
  // @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    // @Req() req: UserRequest,
  ): Promise<{ address: string }> {
    // const user: UserDto = req.user;
    // const oldData = await this.usersService.findOne(user['sub']);
    // if (oldData.profileImage) {
    //   fs.unlink(
    //     join(process.cwd() + '/uploads/profileimages/' + oldData.profileImage),
    //     (err) => console.log(err),
    //   );
    // }

    return {
      address: 'http://localhost:2999/api/achievements/file:' + file.filename,
    };
  }

  @Get('file:imageName')
  // @UseGuards(AccessGuard)
  async downloadFile(
    @Param('imageName') imageName: string,
    // @Req() req: UserRequest,
    @Res() res: Response,
  ) {
    return res.sendFile(
      join(
        process.cwd() + '/uploads/achievements/' + imageName.replace(':', ''),
      ),
    );
  }
}
