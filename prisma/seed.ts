import { PrismaClient, MaterialType, RoomType, StockStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// President Furniture supplies OFFICE, INDUSTRIAL, and HOSPITAL furniture —
// not home furniture. Categories and products reflect that market.
const categories = [
  { name: "Office Desks", slug: "office-desks" },
  { name: "Office Chairs", slug: "office-chairs" },
  { name: "Workstations", slug: "workstations" },
  { name: "Conference Tables", slug: "conference-tables" },
  { name: "Storage & Filing", slug: "storage-filing" },
  { name: "Reception & Lounge", slug: "reception-lounge" },
  { name: "Hospital Furniture", slug: "hospital-furniture" },
  { name: "Industrial Racking", slug: "industrial-racking" },
];

const products = [
  {
    slug: "executive-office-desk",
    name: "Executive Office Desk",
    description:
      "Engineered-wood executive desk with a laminate top, integrated cable management, and a lockable drawer pedestal. Built for daily use in management and administrative offices.",
    price: 39900.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.OFFICE,
    color: "Teak Laminate",
    dimensions: "1600 x 800 x 750 mm",
    deliveryEstimate: "7-10 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 12,
    featured: true,
    categorySlug: "office-desks",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800",
  },
  {
    slug: "ergonomic-mesh-task-chair",
    name: "Ergonomic Mesh Task Chair",
    description:
      "Breathable mesh back with adjustable lumbar support, synchro-tilt mechanism, and height-adjustable arms. The everyday workhorse chair for open workspaces.",
    price: 22900.0,
    material: MaterialType.FABRIC,
    room: RoomType.OFFICE,
    color: "Black",
    dimensions: "680 x 680 x 1150 mm",
    deliveryEstimate: "In stock — ships in 3-5 days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 40,
    featured: true,
    categorySlug: "office-chairs",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800",
  },
  {
    slug: "executive-high-back-leather-chair",
    name: "Executive High-Back Leather Chair",
    description:
      "High-back executive chair in premium bonded leather with a chrome base, class-4 gas lift, and multi-tilt lock. Made for boardrooms and management cabins.",
    price: 34900.0,
    material: MaterialType.LEATHER,
    room: RoomType.OFFICE,
    color: "Black",
    dimensions: "720 x 720 x 1250 mm",
    deliveryEstimate: "7-10 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 18,
    featured: true,
    categorySlug: "office-chairs",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800",
  },
  {
    slug: "modular-4-person-workstation",
    name: "Modular 4-Person Workstation",
    description:
      "A four-seat cluster workstation with 40 mm partition screens, shared cable trays, and a laminate work surface per seat. Scales cleanly across open-plan floors.",
    price: 129900.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.WORKSPACE,
    color: "Grey / Maple",
    dimensions: "2400 x 2400 x 1150 mm",
    deliveryEstimate: "Made to order — 15-20 working days",
    stockStatus: StockStatus.MADE_TO_ORDER,
    stockQty: 0,
    featured: true,
    categorySlug: "workstations",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
  },
  {
    slug: "boardroom-conference-table-8-seat",
    name: "Boardroom Conference Table — 8 Seat",
    description:
      "An eight-seat conference table with a laminate top, powered flip-box for data and power, and a sturdy panel-leg base. The centrepiece of a modern meeting room.",
    price: 64900.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.CONFERENCE,
    color: "Walnut Laminate",
    dimensions: "2400 x 1200 x 750 mm",
    deliveryEstimate: "10-14 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 6,
    featured: true,
    categorySlug: "conference-tables",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
  },
  {
    slug: "steel-4-drawer-filing-cabinet",
    name: "Steel 4-Drawer Filing Cabinet",
    description:
      "Powder-coated steel filing cabinet with four full-extension drawers, a central locking system, and anti-tilt interlock. Foolscap and A4 compatible.",
    price: 27900.0,
    material: MaterialType.METAL,
    room: RoomType.OFFICE,
    color: "Light Grey",
    dimensions: "460 x 620 x 1320 mm",
    deliveryEstimate: "In stock — ships in 3-5 days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 22,
    featured: false,
    categorySlug: "storage-filing",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800",
  },
  {
    slug: "mobile-pedestal-drawer-unit",
    name: "Mobile Pedestal Drawer Unit",
    description:
      "A three-drawer mobile pedestal on castors that rolls under any desk — box, box, and a filing drawer, all lockable.",
    price: 12900.0,
    material: MaterialType.METAL,
    room: RoomType.OFFICE,
    color: "Light Grey",
    dimensions: "390 x 500 x 600 mm",
    deliveryEstimate: "In stock — ships in 3-5 days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 30,
    featured: false,
    categorySlug: "storage-filing",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800",
  },
  {
    slug: "reception-3-seater-sofa",
    name: "Reception 3-Seater Sofa",
    description:
      "A firm, hard-wearing three-seater in premium leather with a powder-coated steel base — sized for busy office and clinic reception areas.",
    price: 89900.0,
    compareAtPrice: 109900.0,
    material: MaterialType.LEATHER,
    room: RoomType.RECEPTION,
    color: "Tan",
    dimensions: "2100 x 850 x 780 mm",
    deliveryEstimate: "10-14 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 8,
    featured: true,
    categorySlug: "reception-lounge",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    slug: "curved-reception-counter",
    name: "Curved Reception Counter",
    description:
      "A curved front-desk counter with a laminate finish, a raised transaction ledge, and a concealed cable route for terminals and phones.",
    price: 74900.0,
    material: MaterialType.ENGINEERED_WOOD,
    room: RoomType.RECEPTION,
    color: "White / Oak",
    dimensions: "2000 x 800 x 1100 mm",
    deliveryEstimate: "Made to order — 15-20 working days",
    stockStatus: StockStatus.MADE_TO_ORDER,
    stockQty: 0,
    featured: false,
    categorySlug: "reception-lounge",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
  },
  {
    slug: "electric-adjustable-hospital-bed",
    name: "Electric Adjustable Hospital Bed",
    description:
      "Five-function electric hospital bed with a powder-coated steel frame, ABS side rails, castors with central braking, and a washable board. Supplied with an IV-pole mount.",
    price: 54900.0,
    material: MaterialType.METAL,
    room: RoomType.HEALTHCARE,
    color: "White",
    dimensions: "2150 x 950 x 500 mm",
    deliveryEstimate: "Made to order — 15-20 working days",
    stockStatus: StockStatus.MADE_TO_ORDER,
    stockQty: 0,
    featured: true,
    categorySlug: "hospital-furniture",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  },
  {
    slug: "stainless-medical-storage-cabinet",
    name: "Stainless Medical Storage Cabinet",
    description:
      "A stainless-steel medical cabinet with glass upper doors, adjustable shelves, and a lockable lower cupboard — easy to wipe down and clinic-ready.",
    price: 38900.0,
    material: MaterialType.METAL,
    room: RoomType.HEALTHCARE,
    color: "Stainless Steel",
    dimensions: "900 x 400 x 1800 mm",
    deliveryEstimate: "10-14 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 10,
    featured: false,
    categorySlug: "hospital-furniture",
    image: "https://images.unsplash.com/photo-1580281658626-ee379f3cce93?w=800",
  },
  {
    slug: "heavy-duty-industrial-shelving",
    name: "Heavy-Duty Industrial Shelving Unit",
    description:
      "Boltless steel racking rated to 350 kg per level, with five adjustable shelves. Configurable into runs for stockrooms, warehouses, and workshops.",
    price: 45900.0,
    material: MaterialType.METAL,
    room: RoomType.INDUSTRIAL,
    color: "Blue / Galvanised",
    dimensions: "1800 x 600 x 2000 mm",
    deliveryEstimate: "7-10 working days",
    stockStatus: StockStatus.IN_STOCK,
    stockQty: 15,
    featured: false,
    categorySlug: "industrial-racking",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800",
  },
];

async function main() {
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
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
        color: p.color,
        dimensions: p.dimensions,
        deliveryEstimate: p.deliveryEstimate,
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
