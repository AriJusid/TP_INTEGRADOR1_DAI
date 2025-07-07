import config from './../configs/config.js'
import pkg from 'pg'

const { Pool }  = pkg;
const pool = new Pool(config)

export default class EventRepo{
    getAll = async () => {
        let alumnosArray = null

        try{
            const sql = 'SELECT * FROM alumnos'
            const result = await pool.query(sql)
            alumnosArray = result.rows
        }
        
        catch(e){
            console.log(error)
        }
        return alumnosArray;
    }
}