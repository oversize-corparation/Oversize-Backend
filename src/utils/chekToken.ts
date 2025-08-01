import { tokenService } from "../lib/jwt";
import { verifyTokenInterface } from "../types/verifyToken.dto";
import { ClientError } from "./error";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new ClientError("Unauthorized!", 401);

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const verifiyToken: verifyTokenInterface = tokenService.verifyToken(token);

    if (req.headers["user-agent"] !== verifiyToken.userAgent) {
      throw new ClientError("Unauthorized!", 401);
    }

    const users = await prisma.users.findUnique({
      where: { id: verifiyToken.user_id },
      select:{ id: true }
    })
    if(!users) throw new ClientError("Unauthorized!", 401);

    req.user = verifiyToken; // ✅ Bu juda muhim!

    return next();
  } catch (error) {
    return next(error);
  }
}

export default checkToken;
