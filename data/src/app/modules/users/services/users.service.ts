import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../../core/interfaces/user.interface';
import { CreateUserDto } from '../../core/dto/create-user.dto';

@Component()
export class UsersService {
    constructor(@Inject('UserModelToken') private readonly userModel: Model<User>) {}

    async list() : Promise<User[]> {
        return await this.userModel.find({});
    }

    async create(user: CreateUserDto) : Promise<User> {
        return await new this.userModel(user).save();
    }

    async get(id: string) : Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async find(email: string) : Promise<User> {
        return await this.userModel.findOne({ email }).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) : Promise<User> {
        let user = await this.get(id);
        for(let key in updateUserDto){
            user[key] = updateUserDto[key];
        }
        return await user.save();
    }

    async remove(id: string) : Promise<User> {
        return await this.userModel.findByIdAndRemove(id).exec();
    }
}
