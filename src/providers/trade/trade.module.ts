import { Module, Global } from '@nestjs/common';
import { TradeProvider, TRADE_PROVIDER_MANAGER } from '.';
import { OrderService } from './services';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
	imports: [AuthModule],
	providers: [
		OrderService,
		{
			provide: TRADE_PROVIDER_MANAGER,
			useClass: TradeProvider,
		},
	],
	exports: [TRADE_PROVIDER_MANAGER],
})
export class TradeModule { }