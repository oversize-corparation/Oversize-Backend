import { tokenService } from "../lib/jwt.js";
import { verifyTokenInterface } from "../types/verifyToken.dto.js";
const { verifyToken } = tokenService;
import { ClientError } from "./error.js";
import { NextFunction } from "express";
import { Request, Response } from "express";

 async function checkToken(req:Request, res:Response, next:NextFunction){
    try {
        const authHeader  = req.headers.authorization;
        if(!authHeader ) throw new ClientError('Unauthorized!', 400);
        const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

        const verifiyToken:verifyTokenInterface = verifyToken(token);
        if(!(req.headers['user-agent'] == verifiyToken.userAgent)) throw new ClientError('Unauthorized!', 400);
        return next();
    } catch (error) {
        return next(error);        
    }
}

export default checkToken;