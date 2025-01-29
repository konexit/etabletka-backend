import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: JwtStrategy.getSecret(configService),
		});
	}

	async validate(payload: any) {
		console.log(payload)
		return { userId: payload.sub, username: payload.username };
	}

	private static getSecret(configService: ConfigService): string {
		const secret = configService.get<string>(JWT_SECRET);
		if (!secret) {
			throw new Error('JWT secret is not defined');
		}
		return secret;
	}
}
