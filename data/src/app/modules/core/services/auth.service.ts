import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Component, Inject, HttpException } from '@nestjs/common';
import { User } from '../interfaces/user.interface';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../dto/user.dto';

const secret = "vjhvjhhlvlkhvjlhvb";

@Component()
export class AuthService {
  constructor(@Inject('UserModelToken') private readonly userModel: Model<User>) {}
  
  async register(credentials: RegisterDto){
    const user = await new this.userModel(credentials).save();
    return this.createToken(user.toDto());
  }

  async login(credentials: LoginDto){
    const { username, password } = credentials;
    const user: User = await this.userModel.findOne({ username }).exec();
    if(!user) throw new HttpException("Error: could not find user!", 401);
    const isMatch: boolean = await user.comparePassword(password);
    if(!isMatch) throw new HttpException("Error: password does not match!", 401);
    return this.createToken(user.toDto());
  }

  async validateToken(token: string){
    if(!token) throw new HttpException("Token not found", 401);
    const decoded = jwt.decode(token);
    if(!decoded) throw new HttpException("Invalid token", 401);
    const user: User = await this.userModel.findById(decoded.id).exec();
    if(!user) throw new HttpException("Deleted user", 401);
    return user.toDto();
  }

  createToken(user : UserDto){
    const expiresIn = 60 * 60;
    const { username, id } = user;
    return jwt.sign({ username, id }, secret, { expiresIn });
  }
}