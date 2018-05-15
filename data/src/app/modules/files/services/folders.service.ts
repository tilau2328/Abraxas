import { Component, Inject, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { FolderDto } from '../dto/folder.dto';
import { File } from '../interfaces/file.interface';
import { Folder } from '../interfaces/folder.interface';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { FilesConnector } from '../connectors/files.connector';

@Component()
export class FoldersService {
    constructor(private readonly filesConnector: FilesConnector,
                @Inject('FileModelToken') private readonly fileModel: Model<File>,
                @Inject('FolderModelToken') private readonly folderModel: Model<Folder>) {}

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

    async create(token: string, createFolderDto: CreateFolderDto): Promise<void> {
        await this.filesConnector.createFolder(token, createFolderDto);
    }

    async update(token: string, id: string, updateFolderDto: UpdateFolderDto): Promise<void> {
        await this.filesConnector.updateFolder(token, id, updateFolderDto);
    }

    async remove(token: string, id: string): Promise<void> {
        await this.filesConnector.removeFolder(token, id);
    }
}