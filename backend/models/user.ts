import { Schema, Document } from "mongoose";

import { getMongooseConnection } from "../connect";
import { IUser } from "../repositories/user";

export type IUserDocument = IUser &
  Document & {
    password: string;
  };

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

export const getUserModel = async () =>
  getMongooseConnection().then((conn) =>
    conn.model<IUserDocument>("User", UserSchema)
  );
