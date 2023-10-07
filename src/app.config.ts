import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import AuthController from "./controllers/auth.controller";
import UserController from "./controllers/user.controller";
import MatchController from "./controllers/match.controller";
import auth from "./middleware/auth";
import passport from 'passport';
import { jwtStrategy } from './config/passport';

/**
 * Import your Room files
 */
import { TreasureHunterRoom } from "./rooms/TreasureHunterRoom";

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', TreasureHunterRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */

        app.use(passport.initialize());
        passport.use('jwt', jwtStrategy);

        app.get("/api/users", auth(), UserController.listUser);
        app.get("/api/users/ranks", UserController.usersRank);
        app.get("/api/users/:id", auth(), UserController.getUser);

        app.post("/api/auth/login", AuthController.login);
        // app.post("/api/auth/logout", AuthController.logout);
        app.post("/api/auth/register", AuthController.register);

        app.get("/api/matchs", MatchController.listMatch);
        app.post("/api/end-game/:userId", auth(), MatchController.endGame);
        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
