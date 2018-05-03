import { Document } from 'mongoose';

export interface File extends Document {
  readonly owner: string;
  readonly title: string;
  readonly path: string;
  
  toDto();
}