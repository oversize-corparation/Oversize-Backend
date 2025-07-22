import { Router } from "express";
import authController from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.get('/', authController.GET_ALL);
authRouter.post('/register', authController.REGISTER);
authRouter.post('/login', authController.LOGIN);
authRouter.post('/send-otp', authController.SEND_OTP);
authRouter.post('/verify-otp', authController.VERIFY_OTP);