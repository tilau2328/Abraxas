import { Controller, HttpStatus, Post, Res, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service'
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Res() res, @Body() registertDto: RegisterDto) {
    const token = await this.authService.register(registertDto);
    res.status(HttpStatus.CREATED).json({token}); 
  }

  @Post('login')
  async login(@Res() res, @Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    res.status(HttpStatus.OK).json({token});
  }
}