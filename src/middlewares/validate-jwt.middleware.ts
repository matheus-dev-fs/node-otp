import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.type";
import { parseJwtFromHeader } from "../helpers/auth.helper";
import type { Result } from "../types/result/result.type";
import type { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "../libs/jwt.lib";
import type { AuthJwtPayload } from "../types/auth-jwt-payload.type";

export const validateJwt = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const tokenResult: Result<string> = parseJwtFromHeader(req);

    if (!tokenResult.success) {
        return res.status(tokenResult.error.statusCode).json({ success: false, errors: tokenResult.error.messages });
    }

    const token: string = tokenResult.data;
    const jwtVerificationResult: Result<AuthJwtPayload> = verifyJwt(token);

    if (!jwtVerificationResult.success) {
        return res.status(jwtVerificationResult.error.statusCode).json(jwtVerificationResult.error);
    }

    const decoded: AuthJwtPayload = jwtVerificationResult.data;
    req.userId = decoded.id;
    next();
}