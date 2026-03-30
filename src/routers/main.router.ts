import { Router } from "express";
import * as pingController from "../controllers/ping.controller.js";

const mainRouter: Router = Router();

mainRouter.get("/ping", pingController.ping);

export default mainRouter;