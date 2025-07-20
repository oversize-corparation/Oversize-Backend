"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_js_1 = require("../lib/jwt.js");
const { verifyToken } = jwt_js_1.tokenService;
const error_js_1 = require("./error.js");
async function checkToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new error_js_1.ClientError('Unauthorized!', 400);
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        const verifiyToken = verifyToken(token);
        if (!(req.headers['user-agent'] == verifiyToken.userAgent))
            throw new error_js_1.ClientError('Unauthorized!', 400);
        return next();
    }
    catch (error) {
        return next(error);
    }
}
exports.default = checkToken;
