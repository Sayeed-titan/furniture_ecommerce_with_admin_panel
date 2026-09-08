-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isProtected` BOOLEAN NOT NULL DEFAULT false,
    `permissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed the two built-in roles that replace the old ADMIN/STAFF enum values.
-- "Administrator" is protected: it always has every permission and can't be
-- edited or deleted, so the panel can never be permission-locked-out.
INSERT INTO `Role` (`id`, `name`, `isProtected`, `permissions`, `createdAt`, `updatedAt`)
VALUES (
    'role_administrator',
    'Administrator',
    true,
    JSON_ARRAY(
        'dashboard.view', 'insights.view',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
        'orders.view', 'orders.edit', 'orders.export',
        'customers.view', 'customers.edit',
        'leads.view', 'leads.edit', 'leads.delete', 'leads.export',
        'issues.view', 'issues.edit', 'issues.delete',
        'settings.view', 'settings.edit',
        'users.view', 'users.create', 'users.edit', 'users.delete'
    ),
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
);

INSERT INTO `Role` (`id`, `name`, `isProtected`, `permissions`, `createdAt`, `updatedAt`)
VALUES (
    'role_staff',
    'Staff',
    false,
    JSON_ARRAY(
        'dashboard.view', 'insights.view',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
        'orders.view', 'orders.edit', 'orders.export',
        'customers.view', 'customers.edit',
        'leads.view', 'leads.edit', 'leads.delete', 'leads.export',
        'issues.view', 'issues.edit', 'issues.delete',
        'settings.view'
    ),
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
);

-- AlterTable: add the new FK column nullable first so we can backfill it.
ALTER TABLE `AdminUser` ADD COLUMN `roleId` VARCHAR(191) NULL;

-- Backfill existing users from the old `role` enum column.
UPDATE `AdminUser` SET `roleId` = 'role_administrator' WHERE `role` = 'ADMIN';
UPDATE `AdminUser` SET `roleId` = 'role_staff' WHERE `role` = 'STAFF';

-- Now that every row has a roleId, make it required and drop the old enum column.
ALTER TABLE `AdminUser` MODIFY COLUMN `roleId` VARCHAR(191) NOT NULL;
ALTER TABLE `AdminUser` DROP COLUMN `role`;

-- CreateIndex + AddForeignKey
CREATE INDEX `AdminUser_roleId_idx` ON `AdminUser`(`roleId`);
ALTER TABLE `AdminUser` ADD CONSTRAINT `AdminUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
