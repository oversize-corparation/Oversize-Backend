import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";
import { loginValidator, userValidator } from "../utils/validator";
import { ClientError } from "../utils/error";
import { tokenService } from "../lib/jwt";
import { hashService } from "../lib/hash";
import { UserRegisterInterface } from "../types/userRegister.dto"
import { UserLoginInterface } from "../types/userLogin.dto";
const { createHash, comparePassword } = hashService;
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
            
            console.log(newUser.id);
            
            
            res.status(201).json({message: 'User successfully registered', status: 201, accessToken: createToken({user_id:newUser.id, userAgent: req.headers['user-agent']})})
        }
        catch(error){
            next(error);
        }
    },
    LOGIN: async function(req:Request, res:Response, next:NextFunction){
        try{
            const user:UserLoginInterface= {
                email: req.body.email.trim(),
                password: req.body.password.trim()
            }
            const validator =  loginValidator.validate(user);
            if(validator.error) throw new ClientError(validator.error.message, 400);

            const isExists = await prisma.users.findUnique({
                where:{email: user.email },
                select:{email: true, password: true, id: true}
            })
            if(!isExists) throw new ClientError("Invalid email or password", 400);
            if(!(await comparePassword(user.password, isExists.password))) throw new ClientError('Invalid email or password', 400);
            res.status(200).json({message: 'User successfully logged in', status: 200, accessToken: createToken({user_id:isExists.id, userAgent: req.headers['user-agent']})})
        }
        catch(error){
            next(error);
        }
    }
}