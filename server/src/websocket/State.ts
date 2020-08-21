import * as socketio from "socket.io";
import path from "path";
import fs from "fs";
import { userSchema } from "@api/type";

interface SocketsState {
  [identity: string]: socketio.Socket[];
}

const socketsState: SocketsState = {};

const add = (identity: string, socket: socketio.Socket) => {
  if (!socketsState[identity]) {
    socketsState[identity] = [];
  }

  socketsState[identity] = [...socketsState[identity], socket];

  return socketsState[identity];
};

const remove = (identity: string, socket: socketio.Socket): any => {
  if (!socketsState[identity]) {
    return null;
  }

  socketsState[identity] = socketsState[identity].filter((s) => s !== socket);

  if (!socketsState[identity].length) {
    socketsState[identity] = undefined;
    delete socketsState[identity];
  }

  return null;
};


const getActiveUsers = (): string[] => {
  return Object.keys(socketsState);
};



const getActiveUsersSessions = (): userSchema[] => {
  const dbPath = path.join(path.resolve(__dirname), "../../db", "user.json"); // resolve the db path of server
  const dbData = fs.readFileSync(dbPath, { encoding: "utf-8" }); // read data from the db
  const userDb: userSchema[] = JSON.parse(dbData);  // convert buffer data to javascript object

  const usersNameList = getActiveUsers();
  const userRes: userSchema[] = userDb.filter((user: userSchema) => {
    if (usersNameList.includes(user.userName)) {
      return user;
    }
  });
  return userRes;
};


const getSocket = (identity: string): any => {
  if (!socketsState[identity]) {
    return null;
  }
  return socketsState[identity];
};


const emit = ({ event, identity, args }: { event: string; identity: string; args: any; }): any => {
  if (!socketsState[identity]) {
    return null;
  }

  socketsState[identity].forEach((socket) =>
    socket.emit("message", { event, identity, args }),
  );

  return null;
};

export { add, remove, emit, getActiveUsers, getActiveUsersSessions };
