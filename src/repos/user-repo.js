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

  signUp = async (name, start_date, tag) => {
    let evento = null;

    let sql = ``;

    let values = [];
    let conditions = [];

    try {
      console.log("SQL Query:", sql);
      console.log("SQL values:", values);

      const result = await pool.query(sql, values);
      evento = result.rows[0];

      console.log("Query Result:", evento);
    } catch (error) {
      console.log("Error:", error);
    }

    return evento;
  };
}
