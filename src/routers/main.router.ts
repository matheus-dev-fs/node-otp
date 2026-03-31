import { Router } from "express";
import * as pingController from "../controllers/ping.controller.js";
import * as authController from "../controllers/auth.controller.js";

const mainRouter: Router = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.post('/auth/signin', authController.signin);
mainRouter.post('/auth/signup', authController.signup);

export default mainRouter;