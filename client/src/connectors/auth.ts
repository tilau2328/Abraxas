import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { LoginCredentials, RegisterCredentials, User } from '../interfaces/auth';

export class AuthConnector {
    private config: AxiosRequestConfig = {
        baseURL: 'http://localhost:3000',
    };

    private instance: AxiosInstance = axios.create(this.config);

    async login(credentials: LoginCredentials): Promise<string> {
        try {
            const res = await this.instance.post('/login', credentials);
            return res.data.token;
        } catch(err) {
            console.log(err);
        }
    }
    
    async register(credentials: RegisterCredentials): Promise<string> {
        try {
            const res = await this.instance.post('/register', credentials);
            return res.data.token;
        } catch(err) {
            console.log(err);
        }
    }
    
    async getSelf(): Promise<User> {
        try {
            const res = await this.instance.get('/users');
            return res.data.user;
        } catch(err) {
            console.log(err);
        }
    }
}
