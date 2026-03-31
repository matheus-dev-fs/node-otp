import { v4 } from "uuid";
import * as otpHelper from "../helpers/otp.helper";
import { prisma } from "../libs/prisma.lib";
import type { Result } from "../types/result/result.type";
import type { Otp } from "../generated/prisma/client";
import { logger } from "../libs/logger.lib";

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