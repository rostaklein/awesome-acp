import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type IDonate = {
  id: number;
  account_login: string;
  char_name?: string;
  character_id: number;
  amount_eur: number;
  amount_coins: number;
  paypal_order_id: string;
  paypal_logs: string;
  status: "in progress" | "rewarded" | "failed";
  created_at: string;
};

export type IDonateCreate = Omit<
  IDonate,
  "id" | "created_at" | "paypal_logs" | "status"
>;

export class DonateRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public addTransaction(donate: IDonateCreate): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO donates (account_login, character_id, amount_eur, amount_coins, paypal_order_id, status) VALUES (?, ?, ?, ?, ?, 'in progress')",
        [
          donate.account_login,
          donate.character_id,
          donate.amount_eur,
          donate.amount_coins,
          donate.paypal_order_id,
        ],
        (err) => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
  }

  public findTransactionByPaypalId(
    paypalOrderId: string
  ): Promise<IDonate | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT * FROM donates WHERE paypal_order_id = ?",
        [paypalOrderId],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve();
          }
          return resolve(results[0]);
        }
      );
    });
  }

  public getAllTransactionsByLogin(login: string): Promise<IDonate[]> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT donates.*, characters.char_name FROM donates JOIN characters ON (character_id = characters.obj_Id) WHERE account_login = ?",
        [login],
        (err, results) => {
          if (err) return reject(err);
          if (results.length === 0) {
            return resolve([]);
          }
          return resolve(results);
        }
      );
    });
  }

  public updateTransactionByPaypalId(
    paypalOrderId: string,
    paypalLogs: string
  ): Promise<IDonate | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE donates SET paypal_logs = ? WHERE paypal_order_id = ?",
        [JSON.stringify(paypalLogs), paypalOrderId],
        (err, results) => {
          if (err) return reject(err);
          return resolve(results[0]);
        }
      );
    });
  }

  public setTransactionStatus(
    paypalOrderId: string,
    status: "rewarded" | "failed"
  ): Promise<IDonate | undefined> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "UPDATE donates SET status = ? WHERE paypal_order_id = ?",
        [status, paypalOrderId],
        (err, results) => {
          if (err) return reject(err);
          return resolve(results[0]);
        }
      );
    });
  }
}
