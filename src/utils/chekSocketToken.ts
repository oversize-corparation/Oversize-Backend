import { tokenService } from "../lib/jwt";
import { verifyTokenInterface } from "../types/verifyToken.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkSocketToken(tokenString:string) {
    if (!tokenString) return { status: false, message: "Unouthorized!" }
    const token = tokenString.startsWith("Bearer ")
      ? tokenString.split(" ")[1]
      : tokenString;

    const verifiyToken: verifyTokenInterface = tokenService.verifyToken(token);
    const user = await prisma.users.findUnique({
      where: { id: verifiyToken.user_id },
      select:{ id: true, role_id: true, firstname: true }
    })
    if(!user) return { status: false, message: "Unouthorized!" }
    else return { status: true, user}
}

export default checkSocketToken;
