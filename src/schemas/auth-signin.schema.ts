import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string({ error: "Email é obrigatório" })
        .email({ message: "Email inválido" }),
});