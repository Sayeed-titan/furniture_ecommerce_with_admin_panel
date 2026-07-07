export function formatMaterial(material: string) {
  return material
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatRoom(room: string) {
  return formatMaterial(room);
}

export function formatStockStatus(status: string) {
  const map: Record<string, string> = {
    IN_STOCK: "In Stock",
    LOW_STOCK: "Low Stock",
    OUT_OF_STOCK: "Out of Stock",
    MADE_TO_ORDER: "Made to Order",
  };
  return map[status] ?? formatMaterial(status);
}
