import { IAuthorizedSocket } from "../interface/IAuthorizedSocket";
import { SocketState } from "../interface/SocketState";

export type SocketMiddleware = (
    socket: IAuthorizedSocket,
    next?: (err?: Error) => void,
) => any;

export type SocketCallback = (
    ...args: any[]
) => void;


export type SocketHandler = (
    socket: IAuthorizedSocket
) => SocketCallback;


export type StoreHandlers = {
    [key: string]: (state: SocketState, key?: string) => Promise<any>;
};