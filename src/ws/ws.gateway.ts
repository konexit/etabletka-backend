import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'events',
  cors: true,
})
export class WsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('Client connected');
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }

  @SubscribeMessage('notifications')
  handleEmit(payload: any): void {
    this.server.emit('notifications', payload);
  }
}
