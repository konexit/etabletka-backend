import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/common/types/jwt/jwt.interfaces';

export const JWTPayload = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as JwtPayload;
});
