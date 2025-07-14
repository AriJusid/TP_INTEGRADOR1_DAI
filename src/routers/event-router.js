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
  
  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await getByID(id);

        if (isNaN(id)) {
            return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
        } 

        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
        }

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});


export default router;