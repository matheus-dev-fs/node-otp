import { type Request } from "express";
import { signinSchema } from "../schemas/auth-signin.schema";
import { getZodErrors } from "../helpers/zod.helper";
import type { Result } from "../types/result/result.type";
import type { Email } from "../types/email.type";
import type { ZodSafeParseResult } from "zod";
import type { InvalidResult } from "../types/result/invalid-result.type";
import type { ValidResult } from "../types/result/valid-result.type";
import type { NameAndEmail } from "../types/name-and-email.type";
import { signupSchema } from "../schemas/auth-signup.schema";

export const signIn = (request: Request): Result<Email> => {
    if (!request.body) {
        const statusCode: number = 400;
        const invalidResult: InvalidResult = getFieldError(statusCode, {
            body: ["O corpo da requisição é obrigatório"]
        });

        return invalidResult;
    }

    const { email }: Email = request.body;
    const result: ZodSafeParseResult<Email> = signinSchema.safeParse({ email });

    if (!result.success) {
        const statusCode: number = 400;
        const errors: Record<string, string[]> = getZodErrors(result);
        const invalidResult: InvalidResult = getFieldError(statusCode, errors);
        return invalidResult;
    }

    const validResult: ValidResult<Email> = {
        success: true,
        data: result.data,
    };

    return validResult;
}

export const signUp = (request: Request): Result<NameAndEmail> => {
    if (!request.body) {
        const statusCode: number = 400;
        const invalidResult: InvalidResult = getFieldError(statusCode, {
            body: ["O corpo da requisição é obrigatório"]
        });
        return invalidResult;
    }

    if (!request.body.name) {
        const statusCode: number = 400;
        const invalidResult: InvalidResult = getFieldError(statusCode, {
            name: ["O campo nome é obrigatório"]
        });
        return invalidResult;
    }

    if (!request.body.email) {
        const statusCode: number = 400;
        const invalidResult: InvalidResult = getFieldError(statusCode, {
            email: ["O campo email é obrigatório"]
        });

        return invalidResult;
    }

    const { name, email }: NameAndEmail = request.body;
    const result: ZodSafeParseResult<NameAndEmail> = signupSchema.safeParse({ name, email });

    if (!result.success) {
        const statusCode: number = 400;
        const errors: Record<string, string[]> = getZodErrors(result);
        const invalidResult: InvalidResult = getFieldError(statusCode, errors);
        return invalidResult;
    }

    const validResult: ValidResult<NameAndEmail> = {
        success: true,
        data: result.data,
    };

    return validResult;
}

export const getFieldError = (statusCode: number, errors: Record<string, string[]>): InvalidResult => {
    const invalidResult: InvalidResult = {
        success: false,
        error: {
            statusCode,
            messages: {
                ...errors,
            },
        }
    };

    return invalidResult;
}