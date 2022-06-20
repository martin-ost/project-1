export function logRequest() {
    return function log(req, res, next) {
        console.log(`${req.method}:${req.url}`);
        next();
    }
}
