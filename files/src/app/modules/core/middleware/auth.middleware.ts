import { Middleware, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../dto/user.dto';
import * as jwt from 'jsonwebtoken';


@Middleware()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}
   resolve(): (req, res, next) => void {
    return async (req, res, next) => {
      const token = req.headers["authentication"];
      try {
        if(token)
          req.user = await this.authService.validateToken(token);
        next();
      } catch(err) {
        if(parseInt(err.getStatus()) < 500) return next();
        res.status(err.getStatus()).send();
      }
    }
  }
}
