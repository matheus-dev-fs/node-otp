import type { PublicUser } from "../types/public-user.type";
import type { UserByEmailResult } from "../types/user-by-email-result.type";

export const toPublicUser = (user: UserByEmailResult): PublicUser => {
    return {
        id: user!.id,
        email: user!.email,
        name: user!.name,
    }
}