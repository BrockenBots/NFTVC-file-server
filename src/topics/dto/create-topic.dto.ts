import { TopicDto } from './topic.dto';

export class CreateTopicDto implements Omit<TopicDto, 'id'> {
  usersCount: number;
  name: string;
  category: 'Основная' | 'Знакомства' | 'Учеба';
  room: string;
  messagesCount: number;
}
