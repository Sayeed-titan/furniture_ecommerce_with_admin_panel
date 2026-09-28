-- CreateTable: StockReceipt — a record of stock added to the catalog.
-- This business manufactures its own furniture (no external suppliers), so
-- `reference` is a free-text internal batch/production note, not a PO number.
CREATE TABLE `StockReceipt` (
    `id` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `note` TEXT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `StockReceipt_createdById_idx` ON `StockReceipt`(`createdById`);
CREATE INDEX `StockReceipt_receivedAt_idx` ON `StockReceipt`(`receivedAt`);

ALTER TABLE `StockReceipt` ADD CONSTRAINT `StockReceipt_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: StockReceiptItem — one product+quantity line per receipt.
CREATE TABLE `StockReceiptItem` (
    `id` VARCHAR(191) NOT NULL,
    `receiptId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `StockReceiptItem_receiptId_idx` ON `StockReceiptItem`(`receiptId`);
CREATE INDEX `StockReceiptItem_productId_idx` ON `StockReceiptItem`(`productId`);

ALTER TABLE `StockReceiptItem` ADD CONSTRAINT `StockReceiptItem_receiptId_fkey` FOREIGN KEY (`receiptId`) REFERENCES `StockReceipt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `StockReceiptItem` ADD CONSTRAINT `StockReceiptItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
