"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../lib/jwt");
const error_1 = require("./error");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function checkToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new error_1.ClientError("Unauthorized!", 401);
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        const verifiyToken = jwt_1.tokenService.verifyToken(token);
        if (req.headers["user-agent"] !== verifiyToken.userAgent) {
            throw new error_1.ClientError("Unauthorized!", 401);
        }
        const users = await prisma.users.findUnique({
            where: { id: verifiyToken.user_id },
            select: { id: true }
        });
        if (!users)
            throw new error_1.ClientError("Unauthorized!", 401);
        req.user = verifiyToken; // ✅ Bu juda muhim!
        return next();
    }
    catch (error) {
        return next(error);
    }
}
exports.default = checkToken;
