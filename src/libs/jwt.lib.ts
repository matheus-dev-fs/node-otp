import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Result } from "../types/result/result.type";
import type { AuthJwtPayload } from "../types/auth-jwt-payload.type";

export const createJwt = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

export const verifyJwt = (token: string): Result<AuthJwtPayload> => {
    try {
        const decoded: JwtPayload | string = jwt.verify(token, process.env.JWT_SECRET as string);

        if (typeof decoded === "string" || typeof decoded.id !== "number") {
            return {
                success: false,
                error: { statusCode: 401, messages: { token: ["Token inválido"] } },
            };
        }

        return { success: true, data: decoded as AuthJwtPayload };
    } catch {
        return {
            success: false,
            error: { statusCode: 401, messages: { token: ["Token inválido"] } },
        };
    }
};