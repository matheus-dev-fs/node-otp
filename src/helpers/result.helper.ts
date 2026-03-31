import type { InvalidResult } from "../types/result/invalid-result.type";

export const getInvalidResult = (statusCode: number, errors: Record<string, string[]>): InvalidResult => {
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