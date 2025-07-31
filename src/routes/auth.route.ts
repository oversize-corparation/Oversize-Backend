import { Router } from "express";
import authController from "../controllers/auth.controller";
import { upload } from "../lib/upload";

export const authRouter = Router();

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Hamma foydalanuvchilarni ko'rish
 *     responses:
 *       200:
 *         description: List of users
 */
authRouter.get('/', authController.GET_ALL);

/**
 * @swagger
 * /api/auth/sign-in/google:
 *   get:
 *     summary: Bu urldan faqat browser orqali boydalaning chunki so'rov yuborilsa boshqa sahifaga qayta yo'naltiradi. Bu url google orqalid register va login qilishga mo'ljallangan.
 *     responses:
 *       200:
 *         description: Redirect to / (main url).
 */
authRouter.get('/sign-in/google', authController.SIGN_IN_GOOGLE);
authRouter.get('/callback/google', authController.CALLBACK_GOOGLE);


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Foydalanuvchini ro'yxatdan o'tkazish (rasm qo'yish ixtiyoriy)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profil rasmi (ixtiyoriy)
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Client errors
 */
authRouter.post('/register', upload.single("image"), authController.REGISTER );

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully logged in
 *       400:
 *         description: Client errors
 */
authRouter.post('/login', authController.LOGIN);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: OTP yuborish
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: OTP yuborildi
 *       400:
 *         description: Client errors
 */
authRouter.post('/send-otp', authController.SEND_OTP);


/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: OTP orqli login qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *               code:
 *                 type: string
 *                 description: User's OTP code
 *             required:
 *               - email
 *               - code
 *     responses:
 *       201:
 *         description: User successfully logged in
 *       400:
 *         description: Client errors
 */
authRouter.post('/verify-otp', authController.VERIFY_OTP);