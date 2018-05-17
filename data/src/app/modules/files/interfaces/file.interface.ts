import { Document } from 'mongoose';

export interface File extends Document {
  readonly directory?: string;
  readonly extension?: string;
  readonly owner: string;
  readonly title: string;
  readonly path: string;
  
  toDto();
}