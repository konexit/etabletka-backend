import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cache, caching } from 'cache-manager';

@Injectable()
export class AuthCacheService implements OnModuleInit {
	private localCacheManager: Cache;

	async onModuleInit(): Promise<void> {
		this.localCacheManager = await caching('memory', {
			max: 100,
			ttl: 0, 
		});
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		await this.localCacheManager.set(key, value, ttl);
	}

	async get<T>(key: string): Promise<T | undefined> {
		return this.localCacheManager.get<T>(key);
	}

	async del(key: string): Promise<void> {
		await this.localCacheManager.del(key);
	}
}
