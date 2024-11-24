import express, { NextFunction, Request, Response, Router } from "express";
import IDatabaseService from "./interfaces/IDatabaseService";
import teamsRouter from "./routers/teamsRouter";
import diContainer, { DI_TOKENS } from "./deps/diContainer";
import TeamRepository from "infrastructure/repositories/TeamRepository";
import createRequestDispatcher from "./deps/createRequestDispatcher";
import errorLogger from "./middleware/errorLogger";
import playersRouter from "./routers/playersRouter";
import PlayerRepository from "infrastructure/repositories/PlayerRepository";
import cors from "cors";

export default function createApplication(config: { port: number; middleware: Array<(req: Request, res: Response, next: NextFunction) => void>; database: IDatabaseService }) {
    const { database } = config;
    const app = express();
    app.options("*", cors());
    console.log("----------------------------");
    app.use(cors());

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);

    // Repositories
    diContainer.register(DI_TOKENS.TEAM_REPOSITORY, new TeamRepository(database));
    diContainer.register(DI_TOKENS.PLAYER_REPOSITORY, new PlayerRepository(database));

    // Request Dispatcher
    const dispatcher = createRequestDispatcher();
    diContainer.register(DI_TOKENS.REQUEST_DISPATCHER, dispatcher);

    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    // const router = Router();
    // router.get("/", (req, res) => {
    //     res.status(200).json()
    // });
    // app.use(router);

    app.use("/api/teams/", teamsRouter);
    app.use("/api/players/", playersRouter);

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);
    return app;
}
