import { Router } from "express";
import { authRouter } from "./auth.route";
import { usersRouter } from "./users.route";
import checkToken from "../utils/chekToken";
import { addressesRouter } from "./addresses.route";

export const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use(checkToken);
mainRouter.use("/users", usersRouter);
mainRouter.use("/addresses", addressesRouter);
