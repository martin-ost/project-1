/* eslint-disable import/prefer-default-export */

export function log() {
    return function myInnerDummyLogger(req, res, next) {
        console.log(`${req.method}:${req.url}`);
        next();
    }
}
