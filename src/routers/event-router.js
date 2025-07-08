import config from '../config/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import {getAll, getOne, getByID} from '../services/event-service.js'
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
  
    try {
      const result = await getOne(name, start_date,  tag);
  
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).send('Evento inexistente');
      }
      return res.status(StatusCodes.OK).json(result);
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
  

  //FALTA ARQUITECTURA

  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        if (isNaN(id)) {
            return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
        }

        const sql = `
        SELECT
    events.id,
    events.name,
    events.description,
    events.id_event_location,
    events.start_date,
    events.duration_in_minutes,
    events.price,
    events.enabled_for_enrollment,
    events.max_assistance,
    events.id_creator_user,

    -- Información de la ubicación del evento
    event_locations.id AS event_location_id,
    event_locations.id_location,
    event_locations.name AS event_location_name,
    event_locations.full_address,
    event_locations.max_capacity AS event_location_max_capacity,
    event_locations.latitude AS event_location_latitude,
    event_locations.longitude AS event_location_longitude,
    event_locations.id_creator_user AS event_location_creator_user,

    -- Información de la localidad
    locations.id AS location_id,
    locations.name AS location_name,
    locations.id_province,
    locations.latitude AS location_latitude,
    locations.longitude AS location_longitude,

    -- Información de la provincia
    provinces.id AS province_id,
    provinces.name AS province_name,
    provinces.full_name AS province_full_name,
    provinces.latitude AS province_latitude,
    provinces.longitude AS province_longitude,

    -- Información del creador del evento
    creator_user.id AS creator_user_id,
    creator_user.first_name AS creator_user_first_name,
    creator_user.last_name AS creator_user_last_name,
    creator_user.username AS creator_user_username
 
FROM events
JOIN event_locations ON events.id_event_location = event_locations.id
JOIN locations ON event_locations.id_location = locations.id
JOIN provinces ON locations.id_province = provinces.id
JOIN users AS creator_user ON events.id_creator_user = creator_user.id
WHERE events.id = $1;
    
            `;
        
        const values = [id]; 
        const result = await pool.query(sql, values);

        if (result.rows.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
        }

        res.status(StatusCodes.OK).json(result.rows[0]);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});


export default router;