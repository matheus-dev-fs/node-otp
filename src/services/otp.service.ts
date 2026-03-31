import { v4 } from "uuid";
import * as otpHelper from "../helpers/otp.helper";
import { prisma } from "../libs/prisma.lib";
import type { Result } from "../types/result/result.type";
import type { Otp } from "../generated/prisma/client";
import { logger } from "../libs/logger.lib";
import type { OTP } from "../types/otp.type";
import type { PublicUser } from "../types/public-user.type";
import { toPublicUser } from "../mappers/user.mapper";

export const generateOTP = async (userId: number): Promise<Result<Otp>> => {
    try {
        const otpCode: string = otpHelper.createOTPCode();
        const expiresAt: Date = otpHelper.createOTPExpirationTime(30);

        const otp: Otp = await prisma.otp.create({
            data: {
                id: v4(),
                code: otpCode,
                expiresAt,
                userId,
            },
        });

        return { success: true, data: otp };
    }
    catch (error: unknown) {
        const err: Error = error instanceof Error ? error : new Error("Unknown error");

        logger.error("otp_generation_failed", {
            service: "otp-service",
            userId,
            message: err.message,
            stack: err.stack,
        });

        return {
            success: false,
            error: {
                statusCode: 500,
                messages: {
                    internal: ["Erro interno ao gerar OTP. Tente novamente mais tarde"],
                }
            },
        };
    }
}

export const validateOTP = async (otpId: string, code: string): Promise<Result<PublicUser>> => {
    try {
        const otp = await prisma.otp.findUnique({
            select: {
                user: true
            },
            where: { 
                id: otpId,
                code,
                expiresAt: { gt: new Date() },
                used: false 
            },
        });
  
        if (!otp || !otp.user) {
            return {
                success: false,
                error: {
                    statusCode: 400,
                    messages: {
                        otp: ["Código OTP inválido ou expirado"],
                    }
                },
            };
        }

        await prisma.otp.update({
            where: { id: otpId },
            data: { used: true },
        });

        const user: PublicUser = toPublicUser(otp.user);

        return { success: true, data: user };
    } catch (error: unknown) {
        const err: Error = error instanceof Error ? error : new Error("Unknown error");

        logger.error("otp_validation_failed", {
            service: "otp-service",
            otpId,
            message: err.message,
            stack: err.stack,
        });

        return {
            success: false,
            error: {
                statusCode: 500,
                messages: {
                    internal: ["Erro interno ao validar OTP. Tente novamente mais tarde"],
                }
            },
        };
    }
}