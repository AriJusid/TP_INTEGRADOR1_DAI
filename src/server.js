import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import config from './configs/config.js'
import EventRouter from './router/event-router.js'

const app  = express();
const port = 3000;

app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON
app.use("/api/event", EventRouter)

// Inicio el Server y lo pongo a escuchar.

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
})