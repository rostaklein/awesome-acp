import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type IAccount = {
  login: string;
  email: string;
};

export type IAccountWithPassword = IAccount & {
  password: string;
};

export class AccountRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public findByLogin(login: string): Promise<IAccountWithPassword | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "select * from accounts where login = ?",
        [login],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve();
          }
          const account = results[0];
          return resolve({
            login: account.login,
            password: account.password,
            email: account.real_email ?? "",
          });
        }
      );
    });
  }
  public createAccount(
    login: string,
    password: string,
    email: string
  ): Promise<IAccount> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO accounts (login, password, accessLevel, real_email) VALUES (?, ?, 0, ?)",
        [login, password, email],
        (err, results) => {
          if (err) {
            return reject(`Failed to create an account, ${err}`);
          }
          return resolve({ login, email });
        }
      );
    });
  }
  public updatePassword(login: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE accounts SET accounts.password = ? WHERE accounts.login= ?",
        [newPassword, login],
        (err, results) => {
          if (err) {
            return reject(`Failed to update account password, ${err}`);
          }
          return resolve();
        }
      );
    });
  }
}
