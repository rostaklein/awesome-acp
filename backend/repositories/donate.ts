import mysql from "mysql";

import { getMysqlConnection } from "../connect";

export type IDonate = {
  id: number;
  account_login: string;
  character_id: number;
  amount_eur: number;
  paypal_order_id: string;
  paypal_logs: string;
  created_at: string;
};

export type IDonateCreate = Omit<IDonate, "id" | "created_at" | "paypal_logs">;

export class DonateRepository {
  private connection: mysql.Connection;
  constructor() {
    this.connection = getMysqlConnection();
  }

  public addTransaction(donate: IDonateCreate): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "INSERT INTO donates (account_login, character_id, amount_eur, paypal_order_id) VALUES (?, ?, ?, ?)",
        [
          donate.account_login,
          donate.character_id,
          donate.amount_eur,
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
          if (results.length === 0) {
            return resolve();
          }
          return resolve(results[0]);
        }
      );
    });
  }
}
