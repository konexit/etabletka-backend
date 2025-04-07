import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';

export function assertHasRole(jwtPayload: JwtPayload, requiredRole: string): void {
	if (
		!jwtPayload ||
		!Array.isArray(jwtPayload.roles) ||
		!jwtPayload.roles.includes(requiredRole)
	) {
		throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
	}
}
