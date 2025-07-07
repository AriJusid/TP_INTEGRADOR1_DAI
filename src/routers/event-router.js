import config from '../config/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import {getAll} from '../services/event-service.js'
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

export default router;