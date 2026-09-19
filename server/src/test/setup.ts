import { afterAll, beforeEach } from "vitest";

process.loadEnvFile(".env.test");

const { prisma } = await import("../prisma");

beforeEach(async () => {
  await prisma.patient.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
