import express from "express";
import cors from "cors"
import helmet from "helmet"
import rateLimiter from "./middleware/rateLimiter.js";
import Account from "./core/account.js";

export const app = express()

const account = new Account()

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

    try {
        await account.init()
    } catch (e) {
        // already init()
    }

    return res.status(200).json({ status: "ok" });
})

app.post("/auth/signup", async (req, res) => {

    const { body } = req
    const { username, password } = body

    try {
        await account.signUp(username, password)
        return res.status(200).json({ status: "ok", username })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})

app.post("/auth/login", async (req, res) => {

    const { body } = req
    const { username, password } = body

    try {
        const response = await account.logIn(username, password)
        return res.status(200).json({ status: "ok", ...response })
    } catch (e) {
        return res.status(500).json({ status: "error", message: e.message })
    }

})
