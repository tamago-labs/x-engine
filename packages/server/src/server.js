import express from "express";
import cors from "cors"
import helmet from "helmet"
import rateLimiter from "./middleware/rateLimiter.js";

export const app = express()

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet())
app.use(rateLimiter)

// Routes

// health-check
app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
})

