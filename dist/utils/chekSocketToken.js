"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../lib/jwt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function checkSocketToken(tokenString) {
    if (!tokenString)
        return { status: false, message: "Unouthorized!" };
    const token = tokenString.startsWith("Bearer ")
        ? tokenString.split(" ")[1]
        : tokenString;
    const verifiyToken = jwt_1.tokenService.verifyToken(token);
    const user = await prisma.users.findUnique({
        where: { id: verifiyToken.user_id },
        select: { id: true, role_id: true, firstname: true }
    });
    if (!user)
        return { status: false, message: "Unouthorized!" };
    else
        return { status: true, user };
}
exports.default = checkSocketToken;
