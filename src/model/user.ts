import { Schema, Model, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isValidPassword: (password: string) => Promise<boolean>;
  hashPassword: (password: string) => Promise<string>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre<IUser>("save", async function () {
  this.password = await hashPassword(this.password);
});

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(13);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

UserSchema.methods.isValidPassword = async function (password: string) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

export const User: Model<IUser> = model<IUser>("User", UserSchema);
