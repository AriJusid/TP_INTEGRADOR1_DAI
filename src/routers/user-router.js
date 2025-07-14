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
        console.log(result.rows )
 

        const payload = {
            id: result.rows.id,
            username: result.rows.username
          };

        console.log("payload" + payload)
          
          const secretKey = 'mansobolazoarilu2025'; 
          
          const options = {
            expiresIn : '1h'
          };
          
        const token = jwt.sign(payload, secretKey, options);   

        console.log("entro a try")
        if(result.rows.length === 0){
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
                token: token
            });
        }

        else{
            res.status(StatusCodes.OK).json({
                sucess: "true",
                message: "",
                token: token
            });
        }
    }

    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});

router.post('/register', async (req, res) => {
    
    const { first_name, last_name, username, password } = req.body;

    try{

        const sql =  'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)'
        
        const values = [first_name, last_name, username, password ]
        const result = await pool.query(sql, values);   
        console.log(result.rows )
 

        const payload = {
            id: result.rows.id,
            username: result.rows.username
          };

        console.log(result.rows.id)
          
          const secretKey = 'mansobolazoarilu2025'; 
          
          const options = {
            expiresIn : '1h'
          };
          
        const token = jwt.sign(payload, secretKey, options);   

        console.log("entro a try")
        if(first_name.length < 3 || last_name.length < 3 || password.length < 3){
            res.status(StatusCodes.BAD_REQUEST).json({
                sucess: "false",
                message: "Usuario o clave inválida.",
                token: token
            });
        }

        else if(!isValidEmail(username)){
            res.status(StatusCodes.BAD_REQUEST).json({
                sucess: "false",
                message: "El email es invalido.",
                token: token
            });
        }

        else{
            res.status(StatusCodes.CREATED).json({
                sucess: "true",
                message: "Bienvenido!",
                token: token
            });
        }
    }

    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
});


export default router;