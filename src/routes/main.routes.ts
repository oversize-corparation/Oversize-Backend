import { Router } from "express";
import { authRouter } from "./auth.route";
import { usersRouter } from "./users.route";

export const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use("/users", usersRouter);
