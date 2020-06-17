import { Application } from "express";
import http, { Server as httpServer } from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./App";
import logger from "./core/utility/Logger";
import config from "./config/Index";
import { initWebSocket } from "./websocket/Index";


const PORT: number = process.env.PORT || config.port;
const HOST: number = process.env.HOST || config.host;

const application: Application = new app().init();
const server: httpServer = http.createServer(application);
initWebSocket(server);



const listen = (): void => {
  server.listen(PORT,
    () => {
      logger.warn(`${config.apiName} is running in IP: ${HOST}  PORT : ${PORT}`);
      logger.info(`Worker ${process.pid} started`);
    });
};


const stopServer = (): void => {
  server.close(() => {
    logger.warn(`${config.apiName}is Stopped in IP: ${HOST}  PORT : ${PORT}`);
  });
};


const startServer = (): void => {
  listen();
};



export {
  startServer,
  stopServer
};
