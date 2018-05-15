import { Component, Inject, HttpException } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { Model } from 'mongoose';
import { unlinkSync } from 'fs';
import { FileDto } from '../dto/file.dto';
import { File } from '../interfaces/file.interface';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';

@Component()
export class FilesService {
    private pubsub: RedisClient;

    constructor(@Inject('FileModelToken') private readonly fileModel: Model<File>) {
        this.pubsub = createClient();
    }
    
    async list(user: string): Promise<File[]> {
        return await this.fileModel.find({ owner: user });
    }

    async get(user: string, id: string): Promise<File> {
        return await this.fileModel.findOne({ owner: user, _id: id });
    }

    async create(user: string, createFileDto: CreateFileDto, directory?: string): Promise<File> {
        const { filename, mimetype, path } = createFileDto;
        const file = await new this.fileModel({ owner: user, title: filename, directory, mimetype, path }).save();
        
        const event = { event: 'fileCreated', data: file.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));

        return file;
    }

    async update(user: string, id: string, updateFileDto: UpdateFileDto): Promise<File> {
        const file = await this.get(user, id);
        if(!file) return;
        for(let key in updateFileDto){
            file[key] = updateFileDto[key];
        }
        const res = await file.save();

        const event = { event: 'fileUpdated', data: file.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));

        return res;
    }

    async remove(user: string, id: string): Promise<File> {
        const file = await this.get(user, id);
        if(!file) throw new HttpException("File not found", 404);
        unlinkSync(file.path);
        const res = await this.fileModel.findByIdAndRemove(id).exec();
        const event = { event: 'fileRemoved', data: file.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));

        return res;
    }
}