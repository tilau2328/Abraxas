import { Component, Inject, HttpException } from '@nestjs/common';
import { createClient, RedisClient } from 'redis';
import { Model } from 'mongoose';
import { FolderDto } from '../dto/folder.dto';
import { File } from '../interfaces/file.interface';
import { Folder } from '../interfaces/folder.interface';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';

@Component()
export class FoldersService {
    private pubsub: RedisClient;

    constructor(@Inject('FileModelToken') private readonly fileModel: Model<File>,
                @Inject('FolderModelToken') private readonly folderModel: Model<Folder>) {
        this.pubsub = createClient();
    }

    async find(user: string, id: string): Promise<Folder> {
        return await this.folderModel.findOne({ owner: user, _id: id });
    }

    async list(user: string, directory?: string): Promise<Folder[]> {
        return await this.folderModel.find({ owner: user, directory: directory });
    }

    async get(user: string, id?: string): Promise<FolderDto> {
        let data = { owner: user, content: [] };
        if(!!id) {
            const folder = await this.find(user, id);
            if(!folder) return;
            data = { ...data, ...folder.toDto() };
        }

        const folders = await this.list(user, id);
        const files = await this.fileModel.find({ owner: user, directory: id });
        files.forEach((file) => data.content.push({ type: 'file', ...file.toDto() }));
        folders.forEach((folder) => data.content.push({ type: 'folder', ...folder.toDto() }));

        return data;
    }

    async create(user: string, createFolderDto: CreateFolderDto): Promise<Folder> {
        const { title, directory } = createFolderDto;
        const folder = await new this.folderModel({ owner: user, title, directory }).save();
        
        const event = { event: 'folderCreated', data: folder.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));
        
        return folder;
    }

    async update(user: string, id: string, updateFolderDto: UpdateFolderDto): Promise<Folder> {
        const folder = await this.find(user, id);
        if(!folder) return;
        for(let key in updateFolderDto){
            folder[key] = updateFolderDto[key];
        }
        const res = await folder.save();
        const event = { event: 'folderUpdated', data: folder.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));

        return res;
    }

    async remove(user: string, id: string): Promise<Folder> {
        const folder = await this.find(user, id);
        if(!folder) throw new HttpException("Folder not found", 404);
        // TODO: Recursive delete
        const res = await this.folderModel.findByIdAndRemove(id).exec();
        const event = { event: 'folderRemoved', data: folder.toDto() };
        this.pubsub.publish('files', JSON.stringify(event));
        return res;
    }
}