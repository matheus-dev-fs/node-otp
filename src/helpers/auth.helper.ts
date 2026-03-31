import type { ExtendedRequest } from "../types/extended-request.type";
import type { Result } from "../types/result/result.type";
import { getInvalidResult } from "./result.helper";

export const parseJwtFromHeader = (req: ExtendedRequest): Result<string> => {
    if (!req.headers) {
        return getInvalidResult(400, {
            headers: ["Os cabeçalhos da requisição são obrigatórios"]
        });
    }

    if (!req.headers.authorization) {
        return getInvalidResult(401, {
            authHeader: ["O cabeçalho de autorização é obrigatório"]
        });
    }

    const authHeaderParts: string[] = req.headers.authorization.split(" ");
    if (authHeaderParts.length !== 2) {
        return getInvalidResult(401, {
            authHeader: ["O cabeçalho de autorização deve conter o tipo e o token separados por espaço"]
        });
    }

    const [authType, token]: string[] = authHeaderParts;
    
    if (authType?.toLowerCase() !== "bearer") {
        return getInvalidResult(401, {
            authType: ["O tipo de autenticação deve ser Bearer"]
        });
    }

    if (!token) {
        return getInvalidResult(401, {
            bearerToken: ["O token de autorização é obrigatório"]
        });
    }

    return { success: true, data: token };
}