import { Connection } from 'mongoose';
import { FolderSchema } from '../schemas/folder.schema';

export const FoldersProviders = [
  {
    provide: 'FolderModelToken',
    useFactory: (connection: Connection) => connection.model('Folder', FolderSchema),
    inject: ['MongoConnectionToken'],
  },
];