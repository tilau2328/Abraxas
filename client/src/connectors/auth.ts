import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../interfaces/auth';

const config: AxiosRequestConfig = {
    baseURL: 'http://localhost:3000',
};

const instance: AxiosInstance = axios.create(config);

export async function login(credentials: LoginCredentials): Promise<string> {
    try {
        const res = await instance.post('/login', credentials);
        return res.data.token;
    } catch(err) {
        console.log(err);
    }
}

export async function register(credentials: RegisterCredentials): Promise<string> {
    try {
        const res = await instance.post('/register', credentials);
        return res.data.token;
    } catch(err) {
        console.log(err);
    }
}

export async function getSelf(): Promise<User> {
    try {
        const res = await instance.get('/users');
        return res.data.user;
    } catch(err) {
        console.log(err);
    }
}
