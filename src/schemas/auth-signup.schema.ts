import z from "zod";

export const signupSchema = z.object({
    name: z.string("Campo nome é obrigatório").min(2, "O nome deve conter pelo menos 2 caracteres"),
    email: z.string("Campo email é obrigatório").email("O email deve ser válido"),
});