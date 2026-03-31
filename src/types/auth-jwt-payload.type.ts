import type { JwtPayload } from "jsonwebtoken";

export type AuthJwtPayload = JwtPayload & {
  id: number;
};