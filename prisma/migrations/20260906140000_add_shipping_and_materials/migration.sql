-- CreateTable: Material (replaces the fixed MaterialType enum with an
-- admin-manageable table).
CREATE TABLE `Material` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nameBn` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Material_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed one row per existing MaterialType enum value, so existing products
-- backfill cleanly below.
INSERT INTO `Material` (`id`, `name`, `nameBn`, `createdAt`, `updatedAt`) VALUES
    ('material_solid_wood', 'Solid Wood', 'সলিড উড', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('material_engineered_wood', 'Engineered Wood', 'ইঞ্জিনিয়ার্ড উড', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('material_artificial_wood', 'Laminate', 'ল্যামিনেট', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('material_leather', 'Leather', 'লেদার', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('material_fabric', 'Fabric', 'ফ্যাব্রিক', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('material_metal', 'Metal', 'মেটাল', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- AlterTable: add the new FK column nullable first so we can backfill it.
ALTER TABLE `Product` ADD COLUMN `materialId` VARCHAR(191) NULL;

-- Backfill from the old `material` enum column.
UPDATE `Product` SET `materialId` = 'material_solid_wood' WHERE `material` = 'SOLID_WOOD';
UPDATE `Product` SET `materialId` = 'material_engineered_wood' WHERE `material` = 'ENGINEERED_WOOD';
UPDATE `Product` SET `materialId` = 'material_artificial_wood' WHERE `material` = 'ARTIFICIAL_WOOD';
UPDATE `Product` SET `materialId` = 'material_leather' WHERE `material` = 'LEATHER';
UPDATE `Product` SET `materialId` = 'material_fabric' WHERE `material` = 'FABRIC';
UPDATE `Product` SET `materialId` = 'material_metal' WHERE `material` = 'METAL';

-- Now that every row has a materialId, drop the old index+column, make the
-- new column required, and add its index + foreign key.
ALTER TABLE `Product` DROP INDEX `Product_material_idx`;
ALTER TABLE `Product` DROP COLUMN `material`;
ALTER TABLE `Product` MODIFY COLUMN `materialId` VARCHAR(191) NOT NULL;
CREATE INDEX `Product_materialId_idx` ON `Product`(`materialId`);
ALTER TABLE `Product` ADD CONSTRAINT `Product_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: reorder-level based low-stock suggestion.
ALTER TABLE `Product` ADD COLUMN `reorderLevel` INT NOT NULL DEFAULT 5;

-- CreateTable: ShippingZone
CREATE TABLE `ShippingZone` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `fee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShippingZone_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed two starter zones with a $0 fee — admin fills in real amounts from
-- /admin/shipping. "Inside Dhaka" is the default pre-selected at checkout.
INSERT INTO `ShippingZone` (`id`, `name`, `fee`, `isDefault`, `createdAt`, `updatedAt`) VALUES
    ('zone_inside_dhaka', 'Inside Dhaka', 0, true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
    ('zone_outside_dhaka', 'Outside Dhaka', 0, false, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- AlterTable: Order gets an optional shippingZoneId (nullable — past orders
-- placed before zones existed have none).
ALTER TABLE `Order` ADD COLUMN `shippingZoneId` VARCHAR(191) NULL;
CREATE INDEX `Order_shippingZoneId_idx` ON `Order`(`shippingZoneId`);
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingZoneId_fkey` FOREIGN KEY (`shippingZoneId`) REFERENCES `ShippingZone`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
