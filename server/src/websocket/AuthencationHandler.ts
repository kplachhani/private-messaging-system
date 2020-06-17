import { socketMessageEnum as socketMessage } from "./types/SocketMessageEnum";
import { SocketMiddleware } from "./types/Type";
import logger from "../core/utility/Logger";
import config from "../config/Index";
import AppError from "../core/utility/AppError";
import { socketEventEnum } from "./types/SocketEventEnum";
import { ISocketUser } from "./interface/IAuthorizedSocket";

export const authenticationHandler: SocketMiddleware = async (socket, next) => {
    const {
        handshake: {
            query: { token = "" } = {},
            headers: { cookie } },
    } = socket;  //***@ get token or cookie from socket handshake.
    try {
        const user = await authenticateToken(token);
        if (!user) {
            logger.warn(`process : ${process.pid} : ${socketMessage.notAuthenticated}: token - ${token}`);
            socket.emit(socketEventEnum.websocketMessage, socketMessage.notAuthenticated);
            next(new AppError(socketMessage.notAuthenticated));
        } else {
            socket.user = user; // @** inject authenticated user in current socket session i.e stateless.
            socket.emit(socketEventEnum.websocketMessage, socketMessage.authenticated);
            logger.info(`process : ${process.pid} : ${socketMessage.authenticated}: token - ${token}`);
            next();
        }
    } catch (err) {
        logger.error(`process : ${process.pid} : ${socketMessage.notAuthenticated}: token - ${token} - error ${err}`);
        next(new AppError(socketMessage.notAuthenticated));
    }

};




const authenticateToken = async (token: string): Promise<ISocketUser> => {
    try {
        const user: ISocketUser = { id: "123", email: "server@gmail.com" };
        return Promise.resolve(user); // @** resolve with user
    } catch (error) {
        logger.warn(`process : ${process.pid} : ${socketMessage.notAuthenticated}: token - ${token} - error ${error}`);
        return Promise.resolve(null);
    }

};