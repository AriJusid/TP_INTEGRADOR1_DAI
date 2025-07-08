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

//FALTA ARQUITECTURA

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
  
router.get('/:id', async (req, res) => {
    const id = req.params.id
    
    try{
        
        console.log("Error de conexión")
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        const sql =  `
        SELECT
        e.id,
        e.name,
        e.description,
        e.start_date,
        e.duration_in_minutes,
        e.price,
        e.enabled_for_enrollment,
        el.max_capacity,
        json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'username', u.username
        ),
        json_build_object(
            'id', el.id,
            'name', el.name,
            'full_address', el.full_address,
            'latitude', el.latitude,
            'longitude', el.longitude,
            'max_capacity', el.max_capacity
        )
    FROM
        events e
    JOIN event_locations el ON e.id_event_location = el.id
    JOIN users u ON e.id_creator_user = u.id;

    WHERE id= $1`
        const values = [id]
        let result = await pool.query(sql, values);    

        res.status(StatusCodes.OK).send(result.rows[0]);
    }
    catch(error){
        if(isNaN(id)){
            res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
        }
        else if (!eventosArray.contains(id)){
            res.status(StatusCodes.NOT_FOUND).send("Evento inexsitente");
        }

        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
})

export default router;