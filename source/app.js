import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { todoRoutes } from './routes/todo-routes.js';

function myDummyLogger(options) {
    // options = options ? options : {};

    return function myInnerDummyLogger(req, res, next) {
        console.log(req.method + ":" + req.url);
        next();
    }
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(express.static(path.resolve(__dirname + '/public/')));
app.use(bodyParser.json());
app.get("/", function (req, res) {
    res.sendFile("/index.html", {root: __dirname + '/public/'});
});
app.use(myDummyLogger());
app.use("", todoRoutes);
