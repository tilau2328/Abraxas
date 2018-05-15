import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../interfaces/auth';
import { IFolder, IFile } from '../interfaces/files';

const dataConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000',
};

const storageConfig: AxiosRequestConfig = {
    baseURL: 'http://localhost:5000/files',
};

const dataInstance: AxiosInstance = axios.create(dataConfig);
const storageInstance: AxiosInstance = axios.create(storageConfig);

export async function upload(form: FormData): Promise<void> {
    try {
        await storageInstance.post('', form);
    } catch(err) {
        console.log(err);
    }
}

export async function download(id: string): Promise<any> {
    try {
        const res = await storageInstance.get(`/${id}/download`, { responseType: 'blob' });
        return res.data;
    } catch(err) {
        console.log(err);
    }
}

export async function getFile(id: string): Promise<any> {
    try {
        const res = await dataInstance.get(`/files/${id}`);
        return res.data;
    } catch(err) {
        console.log(err);
    }
}

export async function updateFile(file: IFile): Promise<void> {
    try {
        await dataInstance.patch(`/files/${file.id}`, file);
    } catch(err) {
        console.log(err);
    }
}

export async function removeFile(id: string): Promise<void> {
    try {
        await dataInstance.delete(`/files/${id}`);
    } catch(err) {
        console.log(err);
    }
}

export async function getFolder(id?: string): Promise<IFolder> {
    try {
        let url = '/folders';
        if(id) url += `/${id}`;
        const res = await dataInstance.get(url);
        return res.data;
    } catch(err) {
        console.log(err);
    }
}

export async function createFolder(folder: IFolder): Promise<void> {
    try {
        await dataInstance.post(`/folders`, folder);
    } catch(err) {
        console.log(err);
    }
}

export async function updateFolder(folder: IFolder): Promise<void> {
    try {
        await dataInstance.patch(`/folders/${folder.id}`, folder);
    } catch(err) {
        console.log(err);
    }
}

export async function removeFolder(id: string): Promise<void> {
    try {
        await dataInstance.delete(`/folders/${id}`);
    } catch(err) {
        console.log(err);
    }
}
