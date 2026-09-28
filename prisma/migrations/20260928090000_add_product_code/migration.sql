-- AlterTable: Category gets a short code (for generated product codes) and
-- a per-category running sequence counter.
ALTER TABLE `Category` ADD COLUMN `shortCode` VARCHAR(191) NOT NULL DEFAULT '';
ALTER TABLE `Category` ADD COLUMN `lastSeq` INTEGER NOT NULL DEFAULT 0;

-- Backfill known seed categories with a sensible short code. Anything not
-- matched here (a category name added since this migration was written)
-- falls through to the generic fallback below — admins can edit it from
-- /admin/categories afterward if it collides with another category's code.
UPDATE `Category` SET `shortCode` = 'CT' WHERE `name` = 'Conference Tables';
UPDATE `Category` SET `shortCode` = 'HF' WHERE `name` = 'Hospital Furniture';
UPDATE `Category` SET `shortCode` = 'IR' WHERE `name` = 'Industrial Racking';
UPDATE `Category` SET `shortCode` = 'OC' WHERE `name` = 'Office Chairs';
UPDATE `Category` SET `shortCode` = 'OD' WHERE `name` = 'Office Desks';
UPDATE `Category` SET `shortCode` = 'RL' WHERE `name` = 'Reception & Lounge';
UPDATE `Category` SET `shortCode` = 'SF' WHERE `name` = 'Storage & Filing';
UPDATE `Category` SET `shortCode` = 'WS' WHERE `name` = 'Workstations';

-- Generic fallback for any category the list above didn't cover: first two
-- letters of the name, uppercased.
UPDATE `Category` SET `shortCode` = UPPER(LEFT(`name`, 2)) WHERE `shortCode` = '';

-- AlterTable: Product gets an optional, unique display code — this is the
-- real uniqueness guard for the generator in src/lib/product-code.ts.
ALTER TABLE `Product` ADD COLUMN `code` VARCHAR(191) NULL;
CREATE UNIQUE INDEX `Product_code_key` ON `Product`(`code`);
