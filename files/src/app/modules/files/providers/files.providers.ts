import { Connection } from 'mongoose';
import { FileSchema } from '../schemas/file.schema';

export const FilesProviders = [
  {
    provide: 'FileModelToken',
    useFactory: (connection: Connection) => connection.model('File', FileSchema),
    inject: ['MongoConnectionToken'],
  },
];