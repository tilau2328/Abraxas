import * as mongoose from 'mongoose';
import { FileDto } from '../dto/file.dto';

export const FileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  path: { type: String, required: true }
});

FileSchema.methods.toDto = function(): FileDto {
  const { title, owner, id } = this;
  return { title, owner, id };
};