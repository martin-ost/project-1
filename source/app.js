import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { todoRoutes } from './routes/todo-routes.js';
import { logRequest } from './util/simple-logger.js'

export const app = express();

try {
    const basedir = dirname(fileURLToPath(import.meta.url));
    app.use(express.static(path.resolve(`${basedir}/public/`)));
    app.use(bodyParser.json());
    app.get("/", (req, res) => {
        res.sendFile('/index.html', {root: `${basedir}/public/`});
    });
    app.use(logRequest());
    app.use(todoRoutes);
} catch (err) {
    console.error(err);
}