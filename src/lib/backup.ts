/**
 * Full-database backup, written as a single JSON file — every table via
 * Prisma, no dependency on a `mysqldump` binary being available on the host
 * (not guaranteed on shared hosting). Restore is intentionally not built
 * yet; this only covers taking and retrieving backups.
 *
 * Stored OUTSIDE public/ (unlike product uploads) since a backup contains
 * password hashes and customer PII — it must never be reachable by a guessed
 * URL, only through the authenticated admin download route.
 *
 * Hostinger note: same persistence concern as public/uploads — this
 * directory must survive redeploys, or point it at a path outside whatever
 * the deploy process replaces.
 */

import { mkdir, readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const BACKUP_DIR = path.join(process.cwd(), "storage", "backups");
const FILENAME_RE = /^backup-\d{8}-\d{6}\.json$/;

async function dumpAllTables() {
  const [
    roles,
    adminUsers,
    categories,
    products,
    productImages,
    leads,
    leadItems,
    siteSettings,
    issueReports,
    customers,
    passwordResetTokens,
    addresses,
    orders,
    orderItems,
    payments,
  ] = await Promise.all([
    prisma.role.findMany(),
    prisma.adminUser.findMany(),
    prisma.category.findMany(),
    prisma.product.findMany(),
    prisma.productImage.findMany(),
    prisma.lead.findMany(),
    prisma.leadItem.findMany(),
    prisma.siteSetting.findMany(),
    prisma.issueReport.findMany(),
    prisma.customer.findMany(),
    prisma.passwordResetToken.findMany(),
    prisma.address.findMany(),
    prisma.order.findMany(),
    prisma.orderItem.findMany(),
    prisma.payment.findMany(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    tables: {
      role: roles,
      adminUser: adminUsers,
      category: categories,
      product: products,
      productImage: productImages,
      lead: leads,
      leadItem: leadItems,
      siteSetting: siteSettings,
      issueReport: issueReports,
      customer: customers,
      passwordResetToken: passwordResetTokens,
      address: addresses,
      order: orders,
      orderItem: orderItems,
      payment: payments,
    },
  };
}

function timestampedFilename(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `backup-${y}${m}${d}-${h}${min}${s}.json`;
}

/** Creates a new backup file on disk and returns its filename. */
export async function createBackup(): Promise<string> {
  const dump = await dumpAllTables();
  const filename = timestampedFilename(new Date());

  await mkdir(BACKUP_DIR, { recursive: true });
  await writeFile(path.join(BACKUP_DIR, filename), JSON.stringify(dump, null, 2));

  return filename;
}

export type BackupFile = { name: string; sizeBytes: number; createdAt: Date };

/** Lists existing backups, newest first. */
export async function listBackups(): Promise<BackupFile[]> {
  await mkdir(BACKUP_DIR, { recursive: true });
  const names = (await readdir(BACKUP_DIR)).filter((n) => FILENAME_RE.test(n));

  const files = await Promise.all(
    names.map(async (name) => {
      const s = await stat(path.join(BACKUP_DIR, name));
      return { name, sizeBytes: s.size, createdAt: s.mtime };
    })
  );

  return files.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Validates the name is a backup this feature actually created (no path
 *  traversal) before any read/delete touches the filesystem. */
export function isValidBackupFilename(name: string): boolean {
  return FILENAME_RE.test(name);
}

export async function readBackupFile(name: string): Promise<Buffer> {
  if (!isValidBackupFilename(name)) throw new Error("Invalid backup filename.");
  return readFile(path.join(BACKUP_DIR, name));
}

export async function deleteBackupFile(name: string): Promise<void> {
  if (!isValidBackupFilename(name)) throw new Error("Invalid backup filename.");
  await unlink(path.join(BACKUP_DIR, name));
}
