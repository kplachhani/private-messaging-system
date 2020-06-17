import { Server } from "http";
import * as socketIO from "socket.io";
import { authenticationHandler } from "./AuthencationHandler";
import { connectHandler } from "./ConnectionHandler";
import config from "../config/Index";


let socket: socketIO.Server;

const initWebSocket = (server: Server) => {
    socket = socketIO.default(server);
    socket.use(authenticationHandler).use(connectHandler);
};

export {
    socket,
    initWebSocket
};
