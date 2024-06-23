import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserRequest } from 'src/auth/dto/auth.dto';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const storage = {
  storage: diskStorage({
    destination: './uploads/eventimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AccessGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto['data']);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessGuard)
  findOne(@Req() req: UserRequest, @Param('id') id: string) {
    return this.eventsService.findOne(+id, +req.user['sub']);
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @UseGuards(AccessGuard)
  @Get('addUser/:id')
  @UseGuards(AccessGuard)
  addUser(@Req() req: UserRequest, @Param('id') eventId: string) {
    return this.eventsService.addUser(+eventId, +req.user['sub']);
  }

  @UseGuards(AccessGuard)
  @Post('photo/:id')
  @UseInterceptors(FileInterceptor('file', storage))
  async addPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') eventId: string,
  ) {
    const oldData = await this.eventsService.findOne(+eventId);
    if (oldData.eventImage) {
      fs.unlink(
        join(process.cwd() + '/uploads/eventimages/' + oldData.eventImage),
        (err) => console.log(err),
      );
    }

    return this.eventsService.update(+eventId, {
      eventImage: file.filename,
    });
  }

  @Get('photo/:imageName')
  async downloadFile(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    return res.sendFile(
      join(process.cwd() + '/uploads/eventimages/' + imageName),
    );
  }

  @UseGuards(AccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
