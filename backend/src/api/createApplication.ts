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
import usersRouter from "./routers/usersRouter";
import UserRepository from "infrastructure/repositories/UserRepository";
import { JsonWebTokenService } from "infrastructure/services/JsonWebTokenService";
import { BcryptPasswordHasher } from "infrastructure/services/BcryptPasswordHasher";
import MatchRepository from "infrastructure/repositories/MatchRepository";
import matchesRouter from "./routers/matchesRouter";
import ApiModelService from "./services/ApiModelService";

export default function createApplication(config: { port: number; middleware: Array<(req: Request, res: Response, next: NextFunction) => void>; database: IDatabaseService }) {
    const { database } = config;
    const app = express();
    app.options("*", cors());
    // console.log("----------------------------");
    app.use(cors());

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);

    // Services
    diContainer.register(DI_TOKENS.JWT_TOKEN_SERVICE, new JsonWebTokenService("super_secret_key"));
    diContainer.register(DI_TOKENS.PASSWORD_HASHER, new BcryptPasswordHasher());
    diContainer.registerFactory(DI_TOKENS.API_MODEL_SERVICE, (diContainer) => {
        const db = diContainer.resolve(DI_TOKENS.DATABASE);
        return new ApiModelService(db);
    });

    // Repositories
    diContainer.register(DI_TOKENS.TEAM_REPOSITORY, new TeamRepository(database));
    diContainer.register(DI_TOKENS.PLAYER_REPOSITORY, new PlayerRepository(database));
    diContainer.register(DI_TOKENS.USER_REPOSITORY, new UserRepository(database));
    diContainer.register(DI_TOKENS.MATCH_REPOSITORY, new MatchRepository(database));

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
    app.use("/api/users/", usersRouter);
    app.use("/api/matches/", matchesRouter);

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);
    return app;
}
