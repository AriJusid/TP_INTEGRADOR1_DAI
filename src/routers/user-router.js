import config from "../config/config.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Router } from "express";
import { logIn, signUp } from "../services/user-service.js";

import pkg from "pg";
import jwt from "jsonwebtoken";

const router = Router();
const { Pool } = pkg;
const pool = new Pool(config);

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    if (!isValidEmail(username)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: "false",
        message: "El email es invalido.",
      });
    }
  
    try {
      const result = await logIn(username, password); 
  
      if (!result || result.length === 0) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: "false",
          message: "Usuario o clave inválida.",
        });
      }
  
      const user = result[0];
      const payload = {
        id: user.id,
        username: user.username,
      };
  
      const secretKey = "mansobolazoarilu2025";
      const options = { expiresIn: "7d" };
      const token = jwt.sign(payload, secretKey, options);
  
      return res.status(StatusCodes.OK).json({
        success: "true",
        message: "",
        token: token,
      });
  
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  });

router.post("/register", async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  try {
    const result = await signUp (first_name, last_name, username, password);
    
    const payload = {
        id:  result.id,
        username:  result.username}

      const secretKey = "mansobolazoarilu2025";
      const options = { expiresIn: "1h" };
      const token = jwt.sign(payload, secretKey, options);
  

    console.log("entro a try");
    if (first_name.length < 3 || last_name.length < 3 || password.length < 3) {
      res.status(StatusCodes.BAD_REQUEST).json({
        sucess: "false",
        message: "Usuario o clave inválida.",
      });
    } else if (!isValidEmail(username)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        sucess: "false",
        message: "El email es invalido.",
      });
    } else {
      res.status(StatusCodes.CREATED).json({
        sucess: "true",
        message: "Bienvenido!",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

export default router;
