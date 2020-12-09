import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type IAccount = {
  login: string;
};

export type IAccountWithPassword = IAccount & {
  password: string;
};

export class AccountRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public findByLogin(login: string): Promise<IAccountWithPassword> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "select * from accounts where login = ?",
        [login],
        (err, results) => {
          if (err) reject(err);
          if (results.length === 0) {
            reject("Account not found");
          }
          const account = results[0];
          resolve({ login: account.login, password: account.password });
        }
      );
    });
  }
}
