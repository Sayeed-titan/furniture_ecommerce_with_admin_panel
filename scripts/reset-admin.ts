/**
 * Create or reset an admin login from the command line.
 *
 *   ADMIN_EMAIL=you@email.com ADMIN_PASSWORD=at-least-8-chars npm run admin:reset
 *
 * If the email already exists, its password is reset (and role bumped to
 * ADMIN). If not, a new ADMIN user is created. Falls back to the SEED_ADMIN_*
 * vars so it lines up with the seed script.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? "")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !email.includes("@") || password.length < 8) {
    console.error(
      "Usage: ADMIN_EMAIL=you@email.com ADMIN_PASSWORD=<at least 8 chars> npm run admin:reset"
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, name, passwordHash, role: "ADMIN" },
  });

  console.log(
    `✔ ${existing ? "Reset password for" : "Created"} admin: ${user.email} (role ${user.role}).`
  );
  console.log("  Sign in at /admin/login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
