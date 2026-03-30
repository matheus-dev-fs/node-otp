import type { RequestHandler } from "express";
import * as authValidators from "../validators/schema.validator";
import * as userService from "../services/user.service";
import type { Email } from "../types/email.type";
import type { Result } from "../types/result/result.type";
import type { PublicUser } from "../types/public-user.type";

export const signin: RequestHandler = async (req, res): Promise<void> => {
    const result: Result<Email> = authValidators.signIn(req);

    if (!result.success) {
        res.status(result.error.statusCode).json(result.error.messages);
        return;
    }

    const email: string = result.data.email;
    const userResult: Result<PublicUser> = await userService.getUserByEmail(email);

    if (!userResult.success) {
        res.status(userResult.error.statusCode).json(userResult.error.messages);
        return;
    }

    res.status(200).json(userResult.data);
};