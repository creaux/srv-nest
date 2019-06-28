import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.types';

const { Types } = Schema;

export const UserSchema = new Schema({
  _id: { type: Types.ObjectId },
  forname: { type: Types.String, required: true },
  surname: { type: Types.String, required: true },
  email: { type: Types.String, required: true, unique: true },
  password: { type: Types.String, required: true },
});

const SALT_WORK_FACTOR = 10;

// Pre save middle to ensure that password is encrypted in db
UserSchema.pre<User>('save', function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err: Error, salt: string) => {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, (err2: Error, hash: string) => {
      if (err2) {
        return next(err2);
      }

      // override the cleartext password with the hashed one
      this.password = hash;
      next();
    });
  });
});
