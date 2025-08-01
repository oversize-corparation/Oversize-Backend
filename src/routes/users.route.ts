import { Router } from "express";
import { usersController } from "../controllers/users.controller";

export const usersRouter = Router();
usersRouter.get("/",  usersController.GET_ALL);
usersRouter.get("/me",  usersController.GET_ME);
usersRouter.put("/:id",  usersController.UPDATE);
usersRouter.delete("/:id", usersController.DELETE);
