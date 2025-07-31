"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const upload_1 = require("../lib/upload");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get('/', auth_controller_1.default.GET_ALL);
/**
 * @swagger
 * /api/auth/sign-in/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Bu urldan faqat browser orqali foydalaning chunki so'rov yuborilsa boshqa sahifaga qayta yo'naltiradi. Bu url google orqalid register va login qilishga mo'ljallangan.
 *     responses:
 *       200:
 *         description: Google authga yo'naltiradi.
 */
exports.authRouter.get('/sign-in/google', auth_controller_1.default.SIGN_IN_GOOGLE);
exports.authRouter.get('/callback/google', auth_controller_1.default.CALLBACK_GOOGLE);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
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
exports.authRouter.post('/register', upload_1.upload.single("image"), auth_controller_1.default.REGISTER);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
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
exports.authRouter.post('/login', auth_controller_1.default.LOGIN);
/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
*     tags:
 *       - Auth
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
exports.authRouter.post('/send-otp', auth_controller_1.default.SEND_OTP);
/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
*     tags:
 *       - Auth
 *     summary: OTP orqli login qilish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
exports.authRouter.post('/verify-otp', auth_controller_1.default.VERIFY_OTP);
