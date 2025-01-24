import { Module, Global } from '@nestjs/common';
import { CDNProvider, CDN_PROVIDER_MANAGER } from '.';
import { CDNService } from './services';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
	imports: [AuthModule],
	providers: [
		CDNService,
		{
			provide: CDN_PROVIDER_MANAGER,
			useClass: CDNProvider,
		},
	],
	exports: [CDN_PROVIDER_MANAGER],
})
export class CDNModule { }