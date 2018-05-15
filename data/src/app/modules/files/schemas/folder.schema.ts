import * as mongoose from 'mongoose';
import { FolderDto } from '../dto/folder.dto';

export const FolderSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  directory: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true }
});

FolderSchema.methods.toDto = function(): FolderDto {
  const { directory, title, owner, id } = this;
  return { directory, title, owner, id };
};