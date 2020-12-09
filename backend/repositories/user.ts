import { FilterQuery } from "mongoose";

import { IUserDocument } from "../models/user";

import { BaseRepository } from "./base";

export type IUser = {
  id: string;
  username: string;
  email: string;
  coins: number;
};

export class UserRepository extends BaseRepository<IUser, IUserDocument> {
  parseDocument(user: IUserDocument): IUser {
    const { _id, username, email, coins } = user;
    return { id: _id, username, email, coins: coins ?? 0 };
  }

  public async findOneWithPassword(
    query: FilterQuery<IUserDocument>
  ): Promise<IUser & { password: string }> {
    const user = await this.findDocument(query);
    return { ...this.parseDocument(user), password: user.password };
  }

  public async addCoinsToUser(userId: string, amount: number): Promise<IUser> {
    const user = await this.findDocument({ _id: userId });

    const newCoinsAmount = (user.coins ?? 0) + amount;

    const updatedUser = await this.update(
      { _id: userId },
      { coins: newCoinsAmount }
    );

    return updatedUser;
  }
}
