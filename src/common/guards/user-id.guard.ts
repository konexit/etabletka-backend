import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwtPayload = request.user;

    if (!jwtPayload || !jwtPayload.userId) {
      throw new ForbiddenException('User access denied');
    }

    return true;
  }
}
