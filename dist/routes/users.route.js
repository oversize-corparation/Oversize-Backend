"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const chekToken_1 = __importDefault(require("../utils/chekToken"));
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get("/", chekToken_1.default, users_controller_1.usersController.GET_ALL);
exports.usersRouter.get("/me", chekToken_1.default, users_controller_1.usersController.GET_ME);
exports.usersRouter.patch("/:id", chekToken_1.default, users_controller_1.usersController.UPDATE);
exports.usersRouter.delete("/:id", chekToken_1.default, users_controller_1.usersController.DELETE);
