import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-promised';
import { UserDto } from '../dto/user.dto';
import { User } from '../interfaces/user.interface';

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user['password'], 10)
  .then((hash) => {
    user['password'] = hash;
    next();
  });
});

UserSchema.methods.comparePassword = async function(password): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.toDto = function(): UserDto {
  const { username, id } = this;
  return { username, id };
};