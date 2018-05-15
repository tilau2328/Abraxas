import { Component, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { File } from '../interfaces/file.interface';
import { UpdateFileDto } from '../dto/update-file.dto';
import { FilesConnector } from '../connectors/files.connector';

@Component()
export class FilesService {
    constructor(private readonly filesConnector: FilesConnector,
                @Inject('FileModelToken') private readonly fileModel: Model<File>) {}
    
    async get(user: string, id: string): Promise<File> {
        return await this.fileModel.findOne({ owner: user, _id: id });
    }

    async update(token: string, id: string, updateFileDto: UpdateFileDto): Promise<void> {
        await this.filesConnector.updateFile(token, id, updateFileDto);
    }

    async remove(token: string, id: string): Promise<void> {
        await this.filesConnector.removeFile(token, id);
    }
}