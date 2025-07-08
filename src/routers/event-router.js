import config from '../config/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import {getAll, getOne} from '../services/event-service.js'
import pkg from 'pg'

const router = Router()

const { Pool }  = pkg;
const pool = new Pool(config)

let eventosArray = []

router.get('/', async (req, res) => {
    try {
        const returnArray = await getAll();
        return res.status(StatusCodes.OK).json(returnArray);
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
});

router.get('/search', async (req, res) => {
    const { name, start_date, tag } = req.query;

  
    let sql = 'SELECT * FROM events WHERE';
    let values = [];
    let conditions = [];
  
    if (name) {
      conditions.push('name = $' + (conditions.length + 1)); 
      values.push(name);
    }
  
    if (start_date) {
      conditions.push('DATE (start_date) = $' + (conditions.length + 1));
      values.push(start_date);
    }
  
    if (tag) {
      conditions.push('id_event_category = $' + (conditions.length + 1));
      values.push(tag);
    }
  
    sql += ' ' + conditions.join(' AND ');
  
    try {
      const result = await pool.query(sql, values);
  
      if (result.rows.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).send('Evento inexistente');
      }
      return res.status(StatusCodes.OK).json(result.rows);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
  
  

export default router;