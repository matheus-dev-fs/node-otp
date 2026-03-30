import type { prisma } from "../libs/prisma.lib";

export type UserByEmailResult = Awaited<ReturnType<typeof prisma.user.findUnique>>;