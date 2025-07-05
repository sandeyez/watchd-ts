import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/generated/prisma-client";

const prisma = new PrismaClient().$extends(withAccelerate());

export { prisma };
