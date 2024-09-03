import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3080, {
  namespace: 'events',
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
  handleMessage(client: any, payload: any): void {
    console.log('Received data:', payload);
    this.server.emit(payload.event, payload);
  }
}
