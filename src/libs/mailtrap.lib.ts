import { MailtrapClient } from "mailtrap";
import type { Result } from "../types/result/result.type";
import { logger } from "./logger.lib";

export const sendEmail = async (to: string, subject: string, text: string): Promise<Result<boolean>> => {
    try {
        const mailtrap = new MailtrapClient({
            token: process.env.MAILTRAP_TOKEN as string,
            sandbox: true,
            testInboxId: 4399686,
        });

        await mailtrap.send({
            from: { name: "Sistema", email: "sistema@exemplo.com" },
            to: [{ email: to }],
            subject,
            text,
        });

        return {
            success: true,
            data: true,
        }
    } catch (error: unknown) {
        logger.error("mailtrap_send_failed", {
            service: "mailtrap-lib",
            to,
            subject,
            message: error instanceof Error ? error.message : "Unknown error",
        });
        
        return {
            success: false,
            error: {
                statusCode: 500,
                messages: {
                    internal: ["Erro interno ao enviar email. Tente novamente mais tarde."],
                }
            }
        }
    }
};