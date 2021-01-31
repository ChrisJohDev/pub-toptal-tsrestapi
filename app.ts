import express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import debug from 'debug';
import { debuglog} from 'util';

const app: express.Application = express();             // The express() function returns the main Express.js application object that we'll pass around the code,
const server: http.Server = http.createServer(app);     // starting by adding it to the http.server object.
const port: Number = 3000;                              // Any port not in use will do. Port 3000 used throughout the documentation for both Node.js and Express.js
const routes: Array<CommonRoutesConfig> = [];           // The routes array will keep track of the routes files for debugging purposes.
const degugLog: debug.IDebugger = debug('app');         // debug.log will be a substitute for console.log. It's easier to finetune because it's automatically 
                                                        // scooped to whatever we want to call our file/module context. Here it's called "app".

// Configuration of all the Express.js middleware modules and the routes of the API.

// adding middleware to parse all incomming requests as JSON.
app.use(bodyParser.json());

// adding middleware to allow cross-origin requests
app.use(cors());

// configuring the expressWinston logging middleware
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app.
routes.push(new UsersRoutes(app));

// configuring the expressWinston error-logging middleware,
// which doesn't *handle* errors per se, but does *log* them
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server up and running!`);
});

// start the server
server.listen(port, () => {
    debuglog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debuglog(`Routes configured for ${route.getName()}`);
    });
});

