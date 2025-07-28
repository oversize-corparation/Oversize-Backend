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
exports.authRouter.get('/sign-in/google', auth_controller_1.default.SIGN_IN_GOOGLE);
exports.authRouter.get('/callback/google', auth_controller_1.default.CALLBACK_GOOGLE);
exports.authRouter.post('/register', upload_1.upload.single("image"), auth_controller_1.default.REGISTER);
exports.authRouter.post('/login', auth_controller_1.default.LOGIN);
exports.authRouter.post('/send-otp', auth_controller_1.default.SEND_OTP);
exports.authRouter.post('/verify-otp', auth_controller_1.default.VERIFY_OTP);
