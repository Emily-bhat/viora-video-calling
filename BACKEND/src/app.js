import "dotenv/config";
import dns from "node:dns";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import express from "express"
import { createServer }from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import   ConnectToSocket   from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js"

dns.setServers(["8.8.8.8"]);

const app = express();
app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "OK" });
});


app.use(helmet());
const server = createServer(app);
const io = ConnectToSocket(server);

app.set("port", (process.env.PORT || 8000))

// app.get("/home",(req, res) => {
//     return res.json({"Hello":"World"});
// });
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://viora-frontend-mtilv9ssi-eb-2e7b.vercel.app"
    ],
    credentials: true
}));

app.options(/.*/, cors());

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        message: "Too many requests. Please try again later."
    }
});

app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);

app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/users", newUserRoutes);

const start = async() => {

    
    const connectionDb = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MONGO connected DB host: ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
    console.log("LISTENING ON PORT:", app.get("port"));
});

};


start();


