import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';

@Module({
  providers: [WsGateway, WsModule],
})
export class WsModule {}
