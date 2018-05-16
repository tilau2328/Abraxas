import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../interfaces/auth';
import { IFolder, IFile } from '../interfaces/files';

export class StorageConnector {
    private config: AxiosRequestConfig = {
        baseURL: 'http://localhost:5000/files',
    };

    private instance: AxiosInstance = axios.create(this.config);

    async upload(form: FormData): Promise<void> {
        try {
            await this.instance.post('', form);
        } catch(err) {
            console.log(err);
        }
    }

    async download(id: string): Promise<Blob> {
        try {
            const res = await this.instance.get(`/${id}/download`, { responseType: 'blob' });
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }
}

export class DataConnector {
    private config: AxiosRequestConfig = {
        baseURL: 'http://localhost:3000',
    };

    private instance: AxiosInstance = axios.create(this.config);

    async getFile(id: string): Promise<any> {
        try {
            const res = await this.instance.get(`/files/${id}`);
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }

    async updateFile(file: IFile): Promise<void> {
        try {
            await this.instance.patch(`/files/${file.id}`, file);
        } catch(err) {
            console.log(err);
        }
    }

    async removeFile(id: string): Promise<void> {
        try {
            await this.instance.delete(`/files/${id}`);
        } catch(err) {
            console.log(err);
        }
    }

    async getFolder(id?: string): Promise<IFolder> {
        try {
            let url = '/folders' + (!!id ? `/${id}` : '');
            const res = await this.instance.get(url);
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }

    async createFolder(folder: IFolder): Promise<void> {
        try {
            await this.instance.post(`/folders`, folder);
        } catch(err) {
            console.log(err);
        }
    }

    async updateFolder(folder: IFolder): Promise<void> {
        try {
            await this.instance.patch(`/folders/${folder.id}`, folder);
        } catch(err) {
            console.log(err);
        }
    }

    async removeFolder(id: string): Promise<void> {
        try {
            await this.instance.delete(`/folders/${id}`);
        } catch(err) {
            console.log(err);
        }
    }    
}
