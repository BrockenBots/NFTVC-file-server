import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { AccessGuard } from 'src/auth/guards/access.guard';

const storage = {
  storage: diskStorage({
    destination: './uploads/adimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
@Controller('api/ad')
export class AdController {
  constructor(private readonly adsService: AdsService) {}

  @UseGuards(AccessGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(+id);
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    return this.adsService.update(+id, updateAdDto);
  }

  @UseGuards(AccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(+id);
  }
}

@Controller('api/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @UseGuards(AccessGuard)
  @Post()
  create(@Body() createAdDto: CreateAdDto) {
    if (!['seek', 'found', 'exchange'].includes(createAdDto.category)) return;
    createAdDto.room = '';
    return this.adsService.create(createAdDto);
  }

  @UseGuards(AccessGuard)
  @Post('photos/:id')
  @UseInterceptors(FilesInterceptor('file', 4, storage))
  uploadPhotos(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') adId: string,
  ) {
    let arrayFiles = [];
    if (files?.length) arrayFiles = files.map((file) => file.filename);
    return this.adsService.update(+adId, {
      photos: arrayFiles,
    });
  }

  @Get('photo/:imageName')
  async downloadFile(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(join(process.cwd() + '/uploads/adimages/' + imageName));
  }

  @Get('')
  findAll() {
    return this.adsService.findAll();
  }

  @Get(':adCategory')
  findAllByCategory(@Param('adCategory') adCategory: string) {
    return this.adsService.findAllByCategory(adCategory);
  }
}
