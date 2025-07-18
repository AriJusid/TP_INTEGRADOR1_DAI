import config from "../config/config.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Router } from "express";
import {
  getAll,
  getOne,
  getByID,
  createEvent,
  getLocationByID,
  updateEvent,
  deleteEvent,
  isValidDate,
  fetchEventUsers,
  newEnrollment,
  deleteEnrollment,
} from "../services/event-service.js";
import pkg from "pg";
import { authToken } from "../middleware/auth.js";

const router = Router();

const { Pool } = pkg;
const pool = new Pool(config);

router.get("/", async (req, res) => {
  try {
    const returnArray = await getAll();
    return res.status(StatusCodes.OK).json(returnArray);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
});

router.get("/search", async (req, res) => {
  const { name, start_date, tag } = req.query;

  try {
    const result = await getOne(name, start_date, tag);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

router.get("/:id", async (req, res) => {
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

router.post("/", authToken, async (req, res) => {
  const {
    name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user,
  } = req.body;

  console.log("Hello");

  const location = await getLocationByID(id_event_location);

  try {
    console.log("entro a try");

    if (
      name.length < 3 ||
      description.length < 3 ||
      price < 0 ||
      duration_in_minutes < 0 ||
      max_assistance > location.max_capacity
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: "false",
        message: "No se pudo crear el evento",
      });
    } else if (typeof req.user === "undefined") {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: "false",
        message: "Debe iniciar sesión primero",
      });
    } else {
      const result = await createEvent(
        name,
        description,
        id_event_category,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_creator_user
      );

      console.log(result);

      res.status(StatusCodes.CREATED).json({
        success: "true",
        message: "Evento creado!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

router.put("/:id", authToken, async (req, res) => {
  const {
    name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user,
  } = req.body;

  const id = parseInt(req.params.id);

  console.log("Hello");

  const location = await getLocationByID(id_event_location);

  try {
    console.log("entro a try");

    if (
      name.length < 3 ||
      description.length < 3 ||
      price < 0 ||
      duration_in_minutes < 0 ||
      max_assistance > location.max_capacity
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: "false",
        message: "No se pudo actualizar el evento",
      });
    } else if (typeof req.user === "undefined") {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: "false",
        message: "Debe iniciar sesión primero",
      });
    } else {
      const result = await updateEvent(
        id,
        name,
        description,
        id_event_category,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_creator_user
      );

      //console.log(result);

      if (!result) {
        console.log("ARRRIIIIIIIIIIIIII - MAL");
        res.status(StatusCodes.NOT_FOUND).json({
          success: "false",
          message: "Evento inexistente",
        });
      } else {
        console.log("ARRRIIIIIIIIIIIIII - OK");
        res.status(StatusCodes.OK).json({
          success: "true",
          message: "Evento actualizado!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

router.delete("/:id", authToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await deleteEvent(id);

    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).send("ID inválido");
    }

    if (result.max_assistance > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Existe al menos un usuario registrado al evento");
    }

    if (typeof result === "undefined") {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: "false",
        message: "Debe iniciar sesión primero",
      });
    }

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
    }

    res.status(StatusCodes.OK).json({
      success: "true",
      message: "Evento eliminado!",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

router.post("/:id/enrollment", authToken, async (req, res) => {
  const id = parseInt(req.params.id);  

  try {
    const eventSelect = await getByID(id);
    if (!eventSelect.max_assistance) {
      return res.status(StatusCodes.BAD_REQUEST).send("Capacidad excedida");
    } else if (!isValidDate(eventSelect.start_date)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Fecha inválida");
    } else if (!eventSelect.enabled_for_enrollment) {
      return res.status(StatusCodes.BAD_REQUEST).send("No se pudo inscribir al evento.");
    } else if ((await fetchEventUsers(id)).includes(req.user.id)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Usted ya está inscripto!");
    } else if (typeof eventSelect === "undefined") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: "false",
        message: "Debe iniciar sesión primero",
      });
    } else if (!eventSelect) {
      return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
    } else {      
      console.log(id, req.user.id)

      const result = await newEnrollment(id, req.user.id);
      res.status(StatusCodes.CREATED).json({
        success: "true",
        message: "Inscripción exitosa!",
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

router.delete("/:id/enrollment", authToken, async (req, res) => {
  const id = parseInt(req.params.id);  

  try {
    const eventSelect = await getByID(id);
    if (!isValidDate(eventSelect.start_date)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Fecha inválida");
    }  else if (!(await fetchEventUsers(id)).includes(req.user.id)) {
      return res.status(StatusCodes.BAD_REQUEST).send("Usted no está inscripto!");
    } else if (typeof eventSelect === "undefined") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: "false",
        message: "Debe iniciar sesión primero",
      });
    } else if (!eventSelect) {
      return res.status(StatusCodes.NOT_FOUND).send("Evento inexistente");
    } else {      
      console.log(id, req.user.id)

      const result = await deleteEnrollment(id, req.user.id);
      res.status(StatusCodes.CREATED).json({
        success: "true",
        message: "Inscripción removida!",
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
});

export default router;
