import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "./core/utility/Logger";

export default class App {

    private initRoutes(app: Application) {
        logger.info("########## Routes initialized ###########");
    }

    private initMiddleware(app: Application) {
        logger.info("########## Middleware initialized ###########");

    }

    private initSecurity(app: Application) {
        app.use(cors());
        app.use(helmet());
        logger.info("########## Security initialized ###########");

    }

    private initExternalModules(app: Application) {
        app.use(morgan("dev"));
        logger.info("########## External Modules initialized ###########");
    }


    public init(): Application {
        const app: Application = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        this.initExternalModules(app);
        this.initSecurity(app);
        this.initRoutes(app);
        this.initMiddleware(app);
        return app;
    }
}