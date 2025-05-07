import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserIdParamGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwtPayload = request.user;
    const userId = Number.parseInt(request.params.userId, 10);

    if (!jwtPayload || jwtPayload.userId !== userId) {
      throw new ForbiddenException('User access denied');
    }

    return true;
  }
}
