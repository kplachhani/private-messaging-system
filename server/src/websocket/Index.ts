import { Server } from "http";
import * as socketIO from "socket.io";
import { connectHandler, authenticationHandler } from "./ConnectionHandler";


let socket: socketIO.Server;

const initWebSocket = (server: Server) => {
    socket = socketIO.default(server);  // initialization socket io and attached the server to the socket io instance
    socket.use(authenticationHandler).use(connectHandler); // attach authentication and connection handler middleware to socket io instance
};

export {
    socket,
    initWebSocket
};
