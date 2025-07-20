import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { userValidator } from "../utils/validator";
import { ClientError } from "../utils/error";
import { tokenService } from "../lib/jwt";
import { hashService } from "../lib/hash";
import { UserRegisterInterface } from "../types/userRegister.dto"
const { createHash } = hashService;
const { createToken } = tokenService;
const prisma = new PrismaClient();

export default {
    GET_ALL: async function(req:Request, res:Response, next:NextFunction){
        try{
            const allUsers = await prisma.users.findMany();
            res.json(allUsers)
        }
        catch(error){
            next(error);
        }
    },
    REGISTER: async function(req:Request, res:Response, next:NextFunction){
        try{
            const user:UserRegisterInterface = req.body;
            const validator =  userValidator.validate(user);
            if(validator.error) throw new ClientError(validator.error.message, 400);

            const isExists = await prisma.users.findUnique({
                where:{email: user.email },
                select:{email: true}
            })

            if(isExists) throw new ClientError("This user already exists", 400);
            if(user.role_id && user.role_id == 1) throw new ClientError('Forbidden !', 403);
            user.role_id = user.role_id || 2;
            user.password = await createHash(user.password);

            const newUser = await prisma.users.create({
                data: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    phone_number: user.phone_number,
                    avatar_url: user.avatar_url,
                    role_id: user.role_id
                }
            })           
            
            res.status(201).json({message: 'User successfully registered', status: 201, accessToken: createToken({user_id:newUser.id, userAgent: req.headers['user-agent']})})
        }
        catch(error){
            next(error);
        }
    }
}