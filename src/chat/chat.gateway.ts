import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  // ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Req, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/guards/ws.guard';
import { UsersService } from 'src/users/users.service';
import { TopicsService } from 'src/topics/topics.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly topicService: TopicsService,
  ) {}

  @UseGuards(WsAuthGuard)
  async handleConnection(socket: Socket) {
    const topic = await this.topicService.findOneByRoom(
      String(socket.handshake.query['room']),
    );
    if (topic && topic.id) {
      console.log('go');
      // await this.topicService.changeCount(topic.id, '+');
    }
  }

  @UseGuards(WsAuthGuard)
  async handleDisconnect(socket: Socket): Promise<void> {
    const room: string = String(socket.handshake.query['room']);
    const topic = await this.topicService.findOneByRoom(
      String(socket.handshake.query['room']),
    );
    if (topic && topic.id) {
      // await this.topicService.changeCount(topic.id, '-');
    }
    this.server.socketsLeave(room);
  }

  @WebSocketServer() server: Server;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getMessages')
  async getMessages(@Req() socket: Socket) {
    const room: string = String(socket.handshake.query['room']);
    const messages = await this.chatService.getMessagesByRoom(room);
    socket.join([room, String(socket.handshake['user']['sub'])]);
    messages.forEach((message) => {
      this.server
        .to(String(socket.handshake['user']['sub']))
        .emit('chat', message);
    });
    socket.join(room);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('chat')
  async handleChatEvent(@Req() req: Socket, @MessageBody() text: string) {
    if (!text.length) return;
    const userFromRequest = req.handshake['user'];
    const room = String(req.handshake.query['room']);
    const user = await this.usersService.findOne(+userFromRequest.sub);
    req.join(room);
    const msg = await this.chatService.createMessage({
      text: text,
      userId: user.id,
      userName: user.fio,
      roomId: room,
    });
    this.server.to(room).emit('chat', msg);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getTopicsMessages')
  async getTopicsMessages(@Req() socket: Socket) {
    const room: string = String(socket.handshake.query['room']);
    const messages = await this.chatService.getMessagesByRoom(room);
    socket.join([room, String(socket.handshake['user']['sub'])]);
    messages.forEach((message) => {
      this.server
        .to(String(socket.handshake['user']['sub']))
        .emit('topicsChat', message);
    });
    socket.join(room);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('topicsChat')
  async handleTopicsChatEvent(@Req() req: Socket, @MessageBody() text: string) {
    if (!text.length) return;
    const userFromRequest = req.handshake['user'];
    const room = String(req.handshake.query['room']);
    const user = await this.usersService.findOne(+userFromRequest.sub);
    req.join(room);
    const msg = await this.chatService.createMessage({
      text: text,
      userId: user.id,
      userName: user.fio,
      roomId: room,
    });
    this.topicService.increaseMessages(room);
    this.server.to(room).emit('topicsChat', msg);
  }
}
