"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
exports.mainRouter = (0, express_1.Router)();
exports.mainRouter.use('/auth', auth_route_1.authRouter);
