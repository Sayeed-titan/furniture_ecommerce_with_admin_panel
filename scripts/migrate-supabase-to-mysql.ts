/**
 * One-time data copy: old Supabase Postgres -> new Hostinger MySQL.
 *
 * Reads every row straight out of Postgres (raw SQL, since the generated
 * Prisma Client is now bound to the mysql provider and can't talk to
 * Postgres) and re-inserts it via Prisma into MySQL, preserving the original
 * cuid() ids so foreign keys stay intact across tables.
 *
 * Run once, against an empty MySQL database:
 *   OLD_DATABASE_URL=<supabase direct connection string> npm run db:migrate-from-supabase
 * (or set OLD_DATABASE_URL in .env and just run the script)
 */
import { PrismaClient, Prisma } from "@prisma/client";
import { Client as PgClient } from "pg";

const prisma = new PrismaClient();

async function copyTable(
  pg: PgClient,
  table: string,
  modelName: string,
  mapRow: (row: Record<string, unknown>) => Record<string, unknown> = (row) => row
) {
  const { rows } = await pg.query(`SELECT * FROM "${table}"`);
  if (rows.length === 0) {
    console.log(`${table}: 0 rows, skipped`);
    return;
  }
  const data = rows.map(mapRow);
  const model = (prisma as unknown as Record<string, { createMany: (args: { data: unknown[] }) => Promise<{ count: number }> }>)[
    modelName
  ];
  const result = await model.createMany({ data });
  console.log(`${table}: migrated ${result.count}/${rows.length}`);
}

async function main() {
  const oldUrl = process.env.OLD_DATABASE_URL;
  if (!oldUrl) {
    console.error(
      "Set OLD_DATABASE_URL to the Supabase Postgres *direct* connection string (port 5432) first."
    );
    process.exit(1);
  }

  const pg = new PgClient({ connectionString: oldUrl, ssl: { rejectUnauthorized: false } });
  await pg.connect();

  try {
    // Parents before children, so foreign keys always resolve.
    await copyTable(pg, "Category", "category");
    await copyTable(pg, "AdminUser", "adminUser");
    await copyTable(pg, "Customer", "customer");
    await copyTable(pg, "Product", "product");
    await copyTable(pg, "ProductImage", "productImage");
    await copyTable(pg, "Address", "address");
    await copyTable(pg, "Lead", "lead");
    await copyTable(pg, "LeadItem", "leadItem");
    await copyTable(pg, "SiteSetting", "siteSetting");
    await copyTable(pg, "IssueReport", "issueReport");
    await copyTable(pg, "Order", "order");
    await copyTable(pg, "OrderItem", "orderItem");
    await copyTable(pg, "Payment", "payment", (row) => ({
      ...row,
      rawPayload: row.rawPayload === null ? Prisma.JsonNull : row.rawPayload,
    }));

    console.log("Migration complete.");
  } finally {
    await pg.end();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
