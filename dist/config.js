"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (!process.env.TOKEN_KEY) {
    throw new Error("TOKEN_KEY is not defined in .env file");
}
exports.serverConfig = {
    PORT: parseInt(process.env.PORT || "4000", 10),
    TOKEN_KEY: process.env.TOKEN_KEY
};
