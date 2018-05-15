import axios, { AxiosInstance } from 'axios';
import { Component, Inject } from '@nestjs/common';
import { UpdateFileDto } from '../dto/update-file.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { CreateFolderDto } from '../dto/create-folder.dto';

@Component()
export class FilesConnector {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:5000',
        });
    }

    async updateFile(token: string, id: string, updateFileDto: UpdateFileDto): Promise<void> {
        const res = await this.client.patch(`/files/${id}`, updateFileDto, {
            headers: { 'authentication': token },
        });
    }

    async removeFile(token: string, id: string): Promise<void> {
        const res = await this.client.delete(`/files/${id}`, {
            headers: { 'authentication': token },
        });
    }

    async createFolder(token: string, createFolderDto: CreateFolderDto): Promise<void> {
        const res = await this.client.post(`/folders`, createFolderDto, {
            headers: { 'authentication': token },
        });
    }

    async updateFolder(token: string, id: string, updateFileDto: UpdateFolderDto): Promise<void> {
        const res = await this.client.patch(`/folders/${id}`, updateFileDto, {
            headers: { 'authentication': token },
        });
    }

    async removeFolder(token: string, id: string): Promise<void> {
        const res = await this.client.delete(`/folders/${id}`, {
            headers: { 'authentication': token },
        });
    }
}