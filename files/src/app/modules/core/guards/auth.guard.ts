import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';

@Guard()
export class AuthGuard implements CanActivate {
  canActivate(req, context: ExecutionContext): boolean {
    return !!req.user;
  }
}
