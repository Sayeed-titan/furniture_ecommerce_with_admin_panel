-- AlterTable
ALTER TABLE `category` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `showOnHome` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isTrending` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `_AdditionalMaterials` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AdditionalMaterials_AB_unique`(`A`, `B`),
    INDEX `_AdditionalMaterials_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AdditionalMaterials` ADD CONSTRAINT `_AdditionalMaterials_A_fkey` FOREIGN KEY (`A`) REFERENCES `Material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AdditionalMaterials` ADD CONSTRAINT `_AdditionalMaterials_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
