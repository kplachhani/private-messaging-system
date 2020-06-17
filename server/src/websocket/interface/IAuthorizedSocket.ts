import * as socketio from "socket.io";

export interface IAuthorizedSocket extends socketio.Socket {
    user?: ISocketUser;
}


export interface ISocketUser {
    id: string;
    email: string;
}
