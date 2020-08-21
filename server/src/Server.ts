import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../.env` });
import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";
import http, { Server as httpServer } from "http";
import cors from "cors";


import config from "./config/Index";
import logger from "./core/utility/Logger";
import { initWebSocket } from "./websocket/Index";
import { route } from "./Route";


const PORT: number = process.env.PORT || config.port;  // get the Server port number from the config file
const HOST: number = process.env.HOST || config.host;  // get the Server host number from the config file

const app: Application = express();  // intialize the express app
app.use(cors()); // enable cross origin resource sharing ... browser security.
app.use(bodyParser.json());   // add the bodypaser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(route); // add the routes to the app
app.use(express.static(path.join(__dirname, "../public"))); //serve static files of server
const server: httpServer = http.createServer(app); // create the http server
initWebSocket(server); // pass the server to websocket initialization

// start listening to the server with the port number.
server.listen(PORT,
  () => {
    logger.warn(`${config.apiName} is running in IP: ${HOST}  PORT : ${PORT}`);
    logger.info(`Worker ${process.pid} started`);
  });

