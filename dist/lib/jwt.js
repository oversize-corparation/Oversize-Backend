"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const { TOKEN_KEY } = config_1.serverConfig;
exports.tokenService = {
    createToken: (payload) => (0, jsonwebtoken_1.sign)(payload, TOKEN_KEY),
    verifyToken: (token) => (0, jsonwebtoken_1.verify)(token, TOKEN_KEY)
};
