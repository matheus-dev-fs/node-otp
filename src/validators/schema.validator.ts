import { type Request } from "express";
import { signinSchema } from "../schemas/auth-signin.schema";
import { getZodErrors } from "../helpers/zod.helper";
import type { Result } from "../types/result/result.type";
import type { Email } from "../types/email.type";
import type { ZodSafeParseResult } from "zod";
import type { InvalidResult } from "../types/result/invalid-result.type";
import type { ValidResult } from "../types/result/valid-result.type";

export const signIn = (request: Request): Result<Email> => {
    if (!request.body) {
        const statusCode: number = 400;
        const invalidResult: InvalidResult = {
            success: false,
            error: {
                statusCode,
                messages: { email: ["O campo email é obrigatório"] },
            }
        };

        return invalidResult;
    }

    const { email }: Email = request.body;
    const result: ZodSafeParseResult<Email> = signinSchema.safeParse({ email });

    if (!result.success) {
        const statusCode: number = 400;
        const errors: Record<string, string[]> = getZodErrors(result);
        const invalidResult: InvalidResult = {
            success: false,
            error: {
                statusCode,
                messages: errors,
            }
        };

        return invalidResult;
    }

    const ValidResult: ValidResult<Email> = {
        success: true,
        data: result.data,
    };

    return ValidResult;
}