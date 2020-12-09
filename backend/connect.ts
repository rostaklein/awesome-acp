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

// const syncAccountsToMysql = (users: IUser[]) =>
//   new Promise((resolve, reject) => {
//     const con = connectMysql();

//     con.connect(function (err) {
//       if (err) reject(err);

//       const sql = "INSERT IGNORE INTO accounts (login, password) VALUES ?";
//       const values = users.map((user) => [user.username, user.password]);

//       con.query(sql, [values], function (err, result) {
//         if (err) reject(err);

//         const timestamp = new Date().toLocaleString();
//         console.log(
//           `${timestamp}: Number of records inserted: ${result.affectedRows}`
//         );
//         resolve();
//       });
//     });
//   });
