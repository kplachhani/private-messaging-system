import fs from "fs";
import path from "path";
import express, { Application, Router, NextFunction, Response, Request } from "express";
import { userSchema } from "./type";


export const route = Router();

route.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, password } = req.body;  // fetch properties from the request body of http request
        const dbPath = path.join(path.resolve(__dirname), "../db", "user.json"); // resolve the db path of server
        const dbData = fs.readFileSync(dbPath, { encoding: "utf-8" }); // read data from the db
        const userDb: userSchema[] = JSON.parse(dbData);  // convert buffer data to javascript object
        const userRes = userDb.find((user) => user.userName === userName && user.password === password); // find the user in db
        res.send(userRes ?? null);
    } catch (error) {
        res.send(error.message);
    }
});















