import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import EventRouter from './routers/event-router.js'
import UserRouter from './routers/user-router.js'
import LocationsRouter from './routers/locations-router.js'



const app  = express();
const port = 3000;

app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON
app.use("/api/event", EventRouter)
app.use("/api/user", UserRouter)
app.use("/api/event-locations", LocationsRouter)

// Inicio el Server y lo pongo a escuchar.

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
})