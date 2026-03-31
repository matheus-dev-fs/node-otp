import { z } from "zod";

export const validateOtpSchema = z.object({
    code: z.string("O código é obrigatório").length(6, { message: "O código deve conter exatamente 6 caracteres" }),
    id: z.string("O ID do OTP é obrigatório").uuid("O ID do OTP é inválido"),
});