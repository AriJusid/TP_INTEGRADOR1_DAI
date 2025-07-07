import config from '../configs/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import service from '../services/alumnos-services.js'
import pkg from 'pg'

const router = Router()

const { Pool }  = pkg;
const pool = new Pool(config)

let alumnosArray = []

router.get('/', async (req, res) => {
    let respuesta;
    const returnArray = await service.getAll()
    try{
        respuesta = res.status(StatusCodes.OK).json(returnArray);
    }

    catch(error){
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        console.log(error)
    }

    return respuesta
});

router.get('/:id', async (req, res) => {
    const id = req.params.id
    
    try{
        
        console.log("Error de conexión")
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);

        const sql =  'SELECT * FROM Alumnos WHERE id = $1'
        const values = [id]
        let result = await pool.query(sql, values);    

        res.status(StatusCodes.OK).send(result.rows[0]);
    }
    catch(error){
        if(isNaN(id)){
            res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
        }
        else if (!alumnosArray.contains(id)){
            res.status(StatusCodes.NOT_FOUND).send("Alumno inexsitente");
        }

        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
})

router.post('', async (req, res) => {
    const { nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
 
    try{

        const sql =  'INSERT INTO alumnos (nombre, apellido, id_curso, fecha_nacimiento, hace_deportes) VALUES ($1, $2, $3, $4, $5)';
        const values = ['Harry', 'Stylesheet', '4', '1994-02-01', '1' ]
        const result = await pool.query(sql, values);    

        console.log("entro a try")
        if(todoCool){
            res.status(StatusCodes.CREATED);
        }

        else if(nombre == null || apellido == null || id_curso == null || fecha_nacimiento == null || hace_deportes == null){
            res.status(StatusCodes.BAD_REQUEST).send("Información vacía");
        }
        
    }

    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
})

router.put('/api/alumnos/', async (req, res) => {
    const { id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes } = req.body;
 
    try{

        const sql = `UPDATE alumnos SET nombre = $2, apellido = $3, id_curso = $4, fecha_nacimiento = $5, hace_deportes = $6 WHERE id = $1`;
        const values = [id, nombre, apellido, id_curso, fecha_nacimiento, hace_deportes]
        const result = await pool.query(sql, values);    

        console.log("entro a try")
        if(result.rowCount > 0){
            res.status(StatusCodes.CREATED).send("Actualización exitosa!");
        }

        else if(id == null | nombre == null || apellido == null || id_curso == null || fecha_nacimiento == null || hace_deportes == null){
            res.status(StatusCodes.BAD_REQUEST).send("Información vacía!");
        }
        
        else if (result.rowCount < 0){
            res.status(StatusCodes.NOT_FOUND).send("Alumno inexsitente!");

        }
    }

    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
}),

router.delete('/api/alumnos/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const values = [id];

    try {

        const sql = 'DELETE FROM alumnos WHERE id = $1';
        const result = await pool.query(sql, values);


        if (result.rowCount > 0) {
            res.status(StatusCodes.OK).send("Alumno eliminado");
        }
        
        else {
            res.status(StatusCodes.NOT_FOUND).send("Alumno inexistente");
        }
    }
    
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    } 
});

export default router;