import { logs } from "../config/logs.js";

export function logRequest(req, _, next) {
  logs.info(`Requested route ${req.url}`);
  req.logError = function (err) {
    logs.error(`There was an error: ${err}`);
  };
  next();
}

export function loginRequest(req, res, next) {
  logs.warn(`Requested route ${req.url}`);
  next();
}
