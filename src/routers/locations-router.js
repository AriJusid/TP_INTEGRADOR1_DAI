import config from "../config/config.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Router } from "express";
import { getEventLocations, getEventLocationByID, createLocation } from "../services/locations-service.js";



import pkg from "pg";
import { authToken } from "../middleware/auth.js";


const router = Router();


const { Pool } = pkg;
const pool = new Pool(config);

router.get("/", authToken, async (req, res) => {
    console.log("a")
 
    try {
      if (req.user === "undefined") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: "false",
          message: "Debe iniciar sesión primero",
        });
      }else{
        const returnArray = await getEventLocations(req.user.id);
        return res.status(StatusCodes.OK).json(returnArray);
      }
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });
 
  router.get("/:id", authToken, async (req, res) => {
    const id = parseInt(req.params.id);  
 
    try {
      const result = await getEventLocationByID(req.user.id, id);


      if (req.user === "undefined") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: "false",
          message: "Debe iniciar sesión primero",
        });
      }else if (!result) {
        return res.status(StatusCodes.NOT_FOUND).send("Event location inexistente");
      }else if (result.id_creator_user != req.user.id){
        return res.status(StatusCodes.NOT_FOUND).send("Solo puede ver lo que usted creó");
      }
      else{
        return res.status(StatusCodes.OK).json(result);
      }
     
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  });
 
  router.post("/", authToken, async (req, res) => {
    const { id } = req.user;
    const {
      id_location,
      name,
      full_address,
      max_capacity,
      latitude,
      longitude,
      id_creator_user 
    } = req.body;
  
  
    try {
      if (
        !name ||
        name.length < 3 ||
        !full_address ||
        full_address.length < 3 ||
        !id_location ||
        parseInt(max_capacity) === undefined ||
        parseInt(max_capacity) <= 0
      ) {
        console.log("max", max_capacity)
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: "false",
          message: "Nombre y dirección deben tener al menos 3 letras. id_location debe existir. max_capacity debe ser mayor a 0.",
        });
      }
      // const location = await getEventLocationByID(id, id_location);

      // if (!location) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     success: "false",
      //     message: "El id_location no existe.",
      //   });
      // }
  
      if (typeof id === "undefined") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: "false",
          message: "Debe iniciar sesión primero.",
        });
      }
      await createLocation(
        id_location,
        name,
        full_address,
        max_capacity,
        latitude,
        longitude,
        id_creator_user
      );
  
      return res.status(StatusCodes.CREATED).json({
        success: "true",
        message: "Event location creada!",
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });
  

  export default router;
