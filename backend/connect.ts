import * as dotenv from "dotenv";
import * as mysql from "mysql";

dotenv.config();

let connection: mysql.Connection | null = null;

export const getMysqlConnection = () => {
  if (connection) {
    return connection;
  }
  const uri = process.env.MYSQL_URI;

  if (!uri) {
    throw new Error("MySQL URI not specified.");
  }

  connection = mysql.createConnection(uri);
  return connection;
};
