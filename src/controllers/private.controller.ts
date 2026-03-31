import type { Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.type";
import * as userService from "../services/user.service";
import type { PublicUser } from "../types/public-user.type";
import type { Result } from "../types/result/result.type";

export const test = async (req: ExtendedRequest, res: Response): Promise<void> => {
    if (!req.userId) {
        res.status(400).json({ success: false, error: { message: "O ID do usuário é obrigatório" } });
        return;
    }

    const userResult: Result<PublicUser> = await userService.getUserById(req.userId);

    if (!userResult.success) {
        res.status(userResult.error.statusCode).json({ success: false, errors: userResult.error.messages });
        return;
    }

    res.status(200).json({ success: true, data: userResult.data });
};