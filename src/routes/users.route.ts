import { Router } from "express";
import { usersController } from "../controllers/users.controller";
import checkToken from "../utils/chekToken";

export const usersRouter = Router();
usersRouter.get("/", checkToken, usersController.GET_ALL);
usersRouter.get("/me", checkToken, usersController.GET_ME);
usersRouter.patch("/:id", checkToken, usersController.UPDATE);
usersRouter.delete("/:id", checkToken, usersController.DELETE);
