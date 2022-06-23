/**
 * @file CAS FEE 2022 / Project 1 / Backend: Logger for Incoming Requests
 *
 * Is registered as express middleware layer in main app.
 *
 * @author Martin Frey <martin.frey@ost.ch>
 */

export function logRequest() {
    return function log(req, res, next) {
        console.log(`${req.method}:${req.url}`);
        next();
    }
}
