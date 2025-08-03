"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
const users_route_1 = require("./users.route");
const chekToken_1 = __importDefault(require("../utils/chekToken"));
exports.mainRouter = (0, express_1.Router)();
exports.mainRouter.use('/auth', auth_route_1.authRouter);
exports.mainRouter.use(chekToken_1.default);
exports.mainRouter.use("/users", users_route_1.usersRouter);
