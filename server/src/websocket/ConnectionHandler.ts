import { SocketMiddleware, SocketHandler, SocketCallback } from "./types/Type";
import { socketEventEnum as socketEvent, socketEventEnum } from "./types/SocketEventEnum";
import AppError from "../core/utility/AppError";
import { socketMessageEnum as socketMessage, socketMessageEnum } from "./types/SocketMessageEnum";
import { add, remove, emit, getActiveUsersSessions } from "./State";
import { socket as io } from "./Index";
import { ISocketUser } from "./interface/IAuthorizedSocket";



export const connectHandler: SocketMiddleware = async (socket, next) => {

    if (!socket.user) {
        return next(new AppError(socketMessage.notAuthenticated));
    }

    const { userName: identity } = socket.user; //**@ get user unique identity.
    add(identity, socket); // add user and its socket to the state variable (i.e storing users and its socket state)
    socket.emit(socketEventEnum.websocketMessage, socketMessage.welcome); // emit the socket welcome message to the client
    socket.on(socketEvent.disconnected, disconnectHandler(socket));   // attac the disconnect handler to the socket

    // attach the handler function to the socket "on" event
    socket.on(socketEventEnum.emitRoom, roomHandler(socket));
    socket.on(socketEventEnum.joinRoom, joinRoomHandler(socket));
    socket.on(socketEventEnum.leaveRoom, leaveRoomHandler(socket));

    socket.on(socketEventEnum.activateE2ERoom, activateE2ERoomHandler(socket));
    socket.on(socketEventEnum.triggerE2ERoom, triggerE2ERoomHandler(socket));

    const activeUsers = getActiveUsersSessions();
    socket.emit(socketEventEnum.activeUsers, activeUsers);   // send the active users and count to the all the client expect current user socket
    io.sockets.emit(socketEventEnum.activeUsers, activeUsers);  // send the active users and count to the  all client
    return next(); // call next() to pass to the next middleware function

};


const disconnectHandler: SocketHandler = (socket) => {
    return async () => {
        const { userName: identity } = socket.user; //**@ get user unique identity.
        remove(identity, socket); // delete the socket user from the state
        const activeUsers = getActiveUsersSessions(); //  get the active number of user from the state
        socket.emit(socketEventEnum.activeUsers, activeUsers);   // send the active users and count to the all the client expect current user socket
        io.sockets.emit(socketEventEnum.activeUsers, activeUsers);   // send the active users and count to all the client
    };
};


const joinRoomHandler: SocketHandler = (socket) => {
    return async (args) => {
        const { userName: identity } = socket.user; //**@ get user unique identity.
        socket.join(args.room);  // join the user to the chat room.
    };
};

const leaveRoomHandler: SocketHandler = (socket) => {
    return async (args) => {
        const { userName: identity } = socket.user; //**@ get user unique identity.
        socket.leave(args.room); // leave the user from the chat room
    };
};

const roomHandler: SocketHandler = (socket) => {
    return async (args) => {
        const { userName: identity } = socket.user; //**@ get user unique identity.
        // io.sockets.in(args.room).emit(socketEventEnum.listenMessage, args); // emit the message in the room
        socket.in(args.room).emit(socketEventEnum.listenMessage, args); // emit the message in the room
        // .... all the connected user in the room will receive the messages
    };
};


export const authenticationHandler: SocketMiddleware = async (socket, next) => {
    const {
        handshake: {
            query: { token = "" } = {},
            headers: { cookie } },
    } = socket;  //***@ get token or cookie from socket handshake.
    try {
        const user = await authenticateToken(token); // authenticate the user with the userName
        if (!user) {
            socket.emit(socketEventEnum.websocketMessage, socketMessage.notAuthenticated); // if user not found emit user not authentiated to the client
            next(new AppError(socketMessage.notAuthenticated)); // throw the error
        } else {
            socket.user = user; // @** inject authenticated user in current socket session i.e stateless.
            socket.emit(socketEventEnum.websocketMessage, socketMessage.authenticated);  // sends user authentiated  message to the client
            next();
        }
    } catch (err) {
        next(new AppError(socketMessage.notAuthenticated));
    }

};

const authenticateToken = async (token: string): Promise<ISocketUser> => {
    try {
        const user: ISocketUser = { id: Math.random().toString(), userName: token }; // create the user random id
        return Promise.resolve(user); // @** resolve with user
    } catch (error) {
        return Promise.resolve(null);
    }

};

const activateE2ERoomHandler: SocketHandler = (socket) => {
    return async (args) => {
        socket.in(args.room).emit(socketEventEnum.activateE2ERoom, args); // emit the message in the room
    };
};

const triggerE2ERoomHandler: SocketHandler = (socket) => {
    return async (args) => {
        io.sockets.in(args.room).emit(socketEventEnum.triggerE2ERoom, args); // emit the message in the room
    };
};
