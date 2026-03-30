import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString: string = `${process.env.DATABASE_URL}`;

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};

const prisma: PrismaClient =
	globalForPrisma.prisma ??
	new PrismaClient({
		adapter: new PrismaPg({ connectionString }),
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export { prisma };