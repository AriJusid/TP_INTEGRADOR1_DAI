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

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
    }

    try {
        const eventReturn = await getOne(id);

        if (!eventReturn || eventReturn.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).send("Evento no encontrado");
        }

        return res.status(StatusCodes.OK).send(eventReturn[0]);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});

export default router;