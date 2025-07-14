import user from "pg/lib/defaults.js";
import config from "./../config/config.js";
import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool(config);

export default class UserRepo {
  logIn = async (username, password) => {
    let sql = `SELECT * FROM users WHERE username = $1 and password = $2`;
    let values = [username, password];

    try {
      console.log("SQL Query:", sql);
      console.log("SQL values:", values);

      const result = await pool.query(sql, values);

      console.log(result.rows)

      return result.rows;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  signUp = async (first_name, last_name, username, password) => {
    let user = null;

    let sql = `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`;

    let values = [first_name, last_name, username, password];

    try {
      console.log("SQL Query:", sql);
      console.log("SQL values:", values);

      const result = await pool.query(sql, values);
      user = result;

      console.log("Query Result:", user);
    } catch (error) {
      console.log("Error:", error);
    }

    return user;
  };
}
