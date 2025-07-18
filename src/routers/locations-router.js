import config from "../config/config.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Router } from "express";
import { getEventLocations, getEventLocationByID } from "../services/locations-service.js";

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
        const returnArray = await getEventLocations();
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
      const result = await getEventLocationByID(id);
  
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
  
  export default router;