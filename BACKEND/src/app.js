import express from "express"
import { createServer }from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import   ConnectToSocket   from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js"
import newUserRoutes from "./routes/newUsers.routes.js";

const app = express();
const server = createServer(app);
const io = ConnectToSocket(server);

app.set("port", (process.env.PORT || 8000))

// app.get("/home",(req, res) => {
//     return res.json({"Hello":"World"});
// });
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
// app.use("/api/v2/users", newUserRoutes);

const start = async() => {

    app.set("mongo_user")
        const connectionDb = await mongoose.connect("mongodb://tintin_2026:idkbd226@ac-l7cbfgv-shard-00-00.c5fbijo.mongodb.net:27017,ac-l7cbfgv-shard-00-01.c5fbijo.mongodb.net:27017,ac-l7cbfgv-shard-00-02.c5fbijo.mongodb.net:27017/?ssl=true&replicaSet=atlas-zm5mb7-shard-0&authSource=admin&appName=VideocallCluster")

        console.log(`MONGO connected DB host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"),() => {
        console.log("LISTENING ON PORT 8000")
    });

}
start();


