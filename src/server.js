import express  from "express"; // npm i express
import cors     from "cors";    // npm i cors
import EventRouter from './routers/event-router.js'
import UserRouter from './routers/user-router.js'
import LocationsRouter from './routers/locations-router.js'

const app  = express();
const port = 4000;

const allowedOrigins = ['http://localhost:5173', 'https://29f049d92c52.ngrok-free.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));       

app.use(express.json()); 
app.use("/api/event", EventRouter)
app.use("/api/user", UserRouter)
app.use("/api/event-locations", LocationsRouter)

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
})