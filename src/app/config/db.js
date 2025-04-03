import mysql from "mysql2/promise";
require("dotenv").config();

// Connect
//   db.connect((err) => {
//     if (err) {
//       throw err;
//     }
//     console.log('MySQL Connected...');
//   });

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.NEXT_HOST_NAME,
  user: process.env.NEXT_DB_USER,
  password: process.env.NEXT_DB_PASSWORD,
  database: process.env.NEXT_DB_NAME,
  port: process.env.NEXT_DB_PORT,
  // waifForConnection :true
});

module.exports = pool;
