import { Router } from "express";
import * as pingController from "../controllers/ping.controller.js";
import * as authController from "../controllers/auth.controller.js";
import * as privateController from "../controllers/private.controller.js";
import { validateJwt } from "../middlewares/validate-jwt.middleware.js";

const mainRouter: Router = Router();

mainRouter.get("/ping", pingController.ping);

mainRouter.post('/auth/signin', authController.signin);
mainRouter.post('/auth/signup', authController.signup);

mainRouter.post('/auth/validateotp', authController.validateOtp);

mainRouter.get('/private', validateJwt, privateController.test);

export default mainRouter;