import { Document } from 'mongoose';

export interface Folder extends Document {
    readonly directory?: string;
    readonly owner: string;
    readonly title: string;
    
    toDto();
}