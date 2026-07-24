-- Reframe RoomType from home-furniture settings to President's actual market:
-- office, industrial, and hospital furniture. Renames preserve existing rows.
ALTER TYPE "RoomType" RENAME VALUE 'LIVING_ROOM' TO 'RECEPTION';
ALTER TYPE "RoomType" RENAME VALUE 'BEDROOM' TO 'HEALTHCARE';
ALTER TYPE "RoomType" RENAME VALUE 'DINING_ROOM' TO 'CONFERENCE';
ALTER TYPE "RoomType" RENAME VALUE 'OUTDOOR' TO 'INDUSTRIAL';
ALTER TYPE "RoomType" RENAME VALUE 'KITCHEN' TO 'WORKSPACE';
