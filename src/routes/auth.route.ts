import { Router } from "express";
import authController from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.get('/', authController.GET_ALL);
authRouter.post('/register', authController.REGISTER);