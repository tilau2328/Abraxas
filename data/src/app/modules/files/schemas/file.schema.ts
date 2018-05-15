import * as mongoose from 'mongoose';
import { FileDto } from '../dto/file.dto';

export const FileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  directory: { type: mongoose.Schema.Types.ObjectId },
  mimetype: { type: String, required: true },
  title: { type: String, required: true }
});

FileSchema.methods.toDto = function(): FileDto {
  const { directory, mimetype, title, owner, id } = this;
  return { directory, mimetype, title, owner, id };
};