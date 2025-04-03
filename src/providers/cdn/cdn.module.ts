import { Module, Global } from '@nestjs/common';
import { CDNProvider, CDN_PROVIDER_MANAGER } from '.';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Global()
@Module({
	imports: [
		AuthModule,
		MulterModule.register({
			storage: memoryStorage()
		}),
	],
	providers: [
		{
			provide: CDN_PROVIDER_MANAGER,
			useClass: CDNProvider,
		},
	],
	exports: [CDN_PROVIDER_MANAGER, MulterModule],
})
export class CDNModule { }