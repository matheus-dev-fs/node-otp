
import { logger } from "../libs/logger.lib";
import { prisma } from "../libs/prisma.lib";
import { toPublicUser } from "../mappers/user.mapper";
import type { PublicUser } from "../types/public-user.type";
import type { Result } from "../types/result/result.type";
import type { UserByEmailResult } from "../types/user-by-email-result.type";

export const getUserByEmail = async (email: string): Promise<Result<PublicUser>> => {
    try {
        const user: UserByEmailResult = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return {
                success: false,
                error: {
                    statusCode: 404,
                    messages: {
                        'user': [`Usuário com o ${email} não encontrado.`],
                    }
                },
            };
        }

        const publicUser: PublicUser = toPublicUser(user);

        return {
            success: true,
            data: publicUser
        };
    } catch (error: unknown) {
        const err: Error = error instanceof Error ? error : new Error("Unknown error");

        logger.error("user_fetch_failed", {
            service: "user-service",
            message: err.message,
            userEmail: email,
            stack: err.stack,
        });

        return {
            success: false,
            error: {
                statusCode: 500,
                messages: {
                    internal: ["Erro interno no servidor. Tente novamente mais tarde."],
                }
            },
        };
    }
}