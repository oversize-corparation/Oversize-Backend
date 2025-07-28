import { Router } from "express";
import authController from "../controllers/auth.controller";
import { upload } from "../lib/upload";

export const authRouter = Router();

authRouter.get('/', authController.GET_ALL);
authRouter.get('/sign-in/google', authController.SIGN_IN_GOOGLE);
authRouter.get('/callback/google', authController.CALLBACK_GOOGLE);
authRouter.post('/register', upload.single("image"), authController.REGISTER );
authRouter.post('/login', authController.LOGIN);
authRouter.post('/send-otp', authController.SEND_OTP);
authRouter.post('/verify-otp', authController.VERIFY_OTP);