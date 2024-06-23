import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { v4 as uuidv4 } from 'uuid';
import { topicsCategories } from './dto/topic.dto';
import { UserRequest } from 'src/auth/dto/auth.dto';

@Controller('api/topic')
export class TopicController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('categories')
  getCategories() {
    return topicsCategories;
  }

  @UseGuards(AccessGuard)
  @Post('changeCount')
  changeCount(
    @Req() req: UserRequest,
    @Body() data: { data: { sign: string; id: number } },
  ) {
    const { sign, id } = data.data;
    return this.topicsService.changeCount(id, sign, +req.user['sub']);
  }
}

@Controller('api/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(AccessGuard)
  @Post()
  create(
    @Body()
    createTopicDto: Omit<
      CreateTopicDto,
      'usersCount' | 'messagesCount' | 'room'
    >,
  ) {
    const createTopic: CreateTopicDto = {
      ...createTopicDto['data'],
      usersCount: 0,
      messagesCount: 0,
      room: uuidv4(),
    };
    return this.topicsService.create(createTopic);
  }

  @Get()
  async findAll() {
    return await this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @UseGuards(AccessGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }
}
