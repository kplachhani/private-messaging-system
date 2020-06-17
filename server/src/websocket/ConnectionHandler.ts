import logger from "../core/utility/Logger";
import { SocketMiddleware, SocketHandler, SocketCallback } from "./types/Type";
import { socketEventEnum as socketEvent, socketEventEnum } from "./types/SocketEventEnum";
import AppError from "../core/utility/AppError";
import { socketMessageEnum as socketMessage, socketMessageEnum } from "./types/SocketMessageEnum";
import { SocketState } from "./interface/SocketState";
import { storeEventsEnum as actionType } from "./types/StoreEventsEnum";


export const connectHandler: SocketMiddleware = async (socket, next) => {

    if (!socket.user) {
        return next(new AppError(socketMessage.notAuthenticated));
    }

    const { email: identity } = socket.user; //**@ get user unique identity.
    const state: SocketState = {
        uniqueIdentity: identity,
        socketId: [socket.id]
    };
    logger.warn(`process: ${process.pid} : ${socketMessageEnum.userJoined} : ${identity}`);
    socket.on(socketEvent.disconnected, disconnectHandler(socket));
    setInterval(() => {
        socket.emit(socketEventEnum.websocketMessage, socketMessage.welcome);
    }, 5000);
    return next();

};


const disconnectHandler: SocketHandler = (socket) => {
    return async () => {
        const { email: identity } = socket.user; //**@ get user unique identity.
        const state: SocketState = {
            uniqueIdentity: identity,
            socketId: [socket.id]
        };
        logger.warn(`process: ${process.pid} : ${socketMessageEnum.userLeft} : ${identity}`);

    };
};
