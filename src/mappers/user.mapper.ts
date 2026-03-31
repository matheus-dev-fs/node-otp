import type { User } from "../generated/prisma/client";
import type { PublicUser } from "../types/public-user.type";

export const toPublicUser = (user: User): PublicUser => {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
    }
}