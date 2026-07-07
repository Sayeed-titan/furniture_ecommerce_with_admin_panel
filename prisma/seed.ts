import { PrismaClient, MaterialType, RoomType, StockStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Sofas", slug: "sofas" },
  { name: "Chairs", slug: "chairs" },
  { name: "Tables", slug: "tables" },
  { name: "Beds", slug: "beds" },
  { name: "Storage", slug: "storage" },
  { name: "Office Desks", slug: "office-desks" },
];

const products = [
  {
    name: "Oakwood Three-Seater Sofa",
    slug: "oakwood-three-seater-sofa",
    description: "A solid oak-frame sofa with premium leather upholstery, built for daily living-room comfort.",
    price: 899.0,
    compareAtPrice: 1099.0,
    material: MaterialType.LEATHER,
    room: RoomType.LIVING_ROOM,
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 12,
    featured: true,
    categorySlug: "sofas",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    name: "Walnut Dining Table (6-Seater)",
    slug: "walnut-dining-table-6-seater",
    description: "Solid walnut dining table with a hand-rubbed finish, seats six comfortably.",
    price: 649.0,
    material: MaterialType.SOLID_WOOD,
    room: RoomType.DINING_ROOM,
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 8,
    featured: true,
    categorySlug: "tables",
    image: "https://images.unsplash.com/photo-1617104551722-3b2d51366400?w=800",
  },
  {
    name: "Executive Office Desk",
    slug: "executive-office-desk",
    description: "Engineered wood desk with cable management, built for the modern home office.",
    price: 399.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.OFFICE,
    stockStatus: StockStatus.LOW_STOCK,
    stockQty: 3,
    featured: false,
    categorySlug: "office-desks",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
  },
  {
    name: "Artisan Accent Chair",
    slug: "artisan-accent-chair",
    description: "Artificial-wood frame accent chair with fabric upholstery, light and durable.",
    price: 229.0,
    material: MaterialType.ARTIFICIAL_WOOD,
    room: RoomType.LIVING_ROOM,
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 20,
    featured: false,
    categorySlug: "chairs",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
  },
  {
    name: "Solid Wood Platform Bed",
    slug: "solid-wood-platform-bed",
    description: "Minimalist platform bed frame in solid pine, queen size.",
    price: 549.0,
    material: MaterialType.SOLID_WOOD,
    room: RoomType.BEDROOM,
    stockStatus: StockStatus.MADE_TO_ORDER,
    stockQty: 0,
    featured: true,
    categorySlug: "beds",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
  },
  {
    name: "Modular Storage Cabinet",
    slug: "modular-storage-cabinet",
    description: "Engineered wood storage cabinet with adjustable shelves, fits any room.",
    price: 279.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.LIVING_ROOM,
    stockStatus: StockStatus.OUT_OF_STOCK,
    stockQty: 0,
    featured: false,
    categorySlug: "storage",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
  },
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  for (const p of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: p.categorySlug },
    });
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        material: p.material,
        room: p.room,
        stockStatus: p.stockStatus,
        stockQty: p.stockQty,
        featured: p.featured,
        categoryId: category.id,
        images: {
          create: [{ url: p.image, alt: p.name, position: 0 }],
        },
      },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: Role.ADMIN,
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword} (change this after first login)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
