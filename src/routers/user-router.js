import config from '../config/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import {getAll, getOne, getByID} from '../services/event-service.js'
import pkg from 'pg'
import jwt from 'jsonwebtoken';

const router = Router()
const { Pool }  = pkg;
const pool = new Pool(config)

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email); 
}

router.post('/login', async (req, res) => {
    
    const { username, password } = req.body;

    try{

        const sql =  'SELECT * FROM users WHERE username = $1 and password = $2'
        
        const values = [username, password ]
        const result = await pool.query(sql, values);    

        const payload = {
            id: result[0].id,
            username: result[0].username
          };
          
          const secretKey = 'mansobolazoarilu2025'; 
          
          const options = {
            expiresIn : '1h', 
            issuer : 'uatafac'
          };
          
        const token = jwt.sign(payload, secretKey, options);   

        console.log("entro a try")
        if(result.length === 0){
            res.status(StatusCodes.UNAUTHORIZED).json({
                sucess: "false",
                message: "Usuario o clave inválida.",
                token: token
            });
        }

        else if(!isValidEmail(username)){
            res.status(StatusCodes.BAD_REQUEST).json({
                sucess: "false",
                message: "El email es invalido.",
                token: "esta"
            });
        }

        else{
            res.status(StatusCodes.OK).json({
                sucess: "true",
                message: "",
                token: "esta"
            });
        }
        
    }

    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});


export default router;