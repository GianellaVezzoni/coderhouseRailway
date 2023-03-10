import winston from "winston";

export const logs = winston.createLogger({
    level: "warning",
    transports: [
        new winston.transports.Console({ level: "info"}),
        new winston.transports.File({ filename: "./logs/warn.log", level: "warn"}),
        new winston.transports.File({ filename: "./logs/errors.log", level: "error"})
    ]
});