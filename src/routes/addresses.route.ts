import { Router } from "express";
import { addressesController } from "../controllers/addresses.controller";
import checkToken from "../utils/chekToken";

export const addressesRouter = Router();
addressesRouter.get("/", checkToken, addressesController.GET_ALL);
addressesRouter.post("/", checkToken, addressesController.CREATE);
addressesRouter.patch("/:id", checkToken, addressesController.UPDATE);
addressesRouter.delete("/:id", checkToken, addressesController.DELETE);
