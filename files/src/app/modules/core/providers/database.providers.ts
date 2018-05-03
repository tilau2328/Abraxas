import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'MongoConnectionToken',
    useFactory: async () => {
      (mongoose as any).Promise = global.Promise;
      return await mongoose.connect('mongodb://localhost/abraxas');
    },
  },
];