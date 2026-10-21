
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, "../certs/ca.pem"),
      "utf8"
    ),
  },
  dateStrings: ["DATE"],
});

module.exports = pool.promise();
