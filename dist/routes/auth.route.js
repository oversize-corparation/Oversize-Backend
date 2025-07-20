"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get('/', auth_controller_1.default.GET_ALL);
exports.authRouter.post('/register', auth_controller_1.default.REGISTER);
