import config from './../config/config.js'
import pkg from 'pg'

const { Pool }  = pkg;
const pool = new Pool(config)

export default class EventRepo {
    getAll = async () => {
        let eventosArray = null;
        try {
            const sql = 'SELECT * FROM events';
            const result = await pool.query(sql);
            eventosArray = result.rows;
        } catch (e) {
            console.log(e);
        }
        return eventosArray;
    }
}