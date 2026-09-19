import { afterAll, beforeEach } from "vitest";

import { existsSync } from "node:fs";

if (existsSync(".env.test")) process.loadEnvFile(".env.test");

const { prisma } = await import("../prisma");

beforeEach(async () => {
  await prisma.patient.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
