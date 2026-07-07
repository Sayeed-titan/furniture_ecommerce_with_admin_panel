import { Hammer, ShieldCheck, Truck, Wallet } from "lucide-react";

const values = [
  {
    icon: Hammer,
    title: "Built to Order",
    description: "Every piece is crafted from solid or engineered wood with attention to detail.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guaranteed",
    description: "Durable materials and finishes backed by our workmanship guarantee.",
  },
  {
    icon: Truck,
    title: "Home & Office Delivery",
    description: "We coordinate delivery and setup so your furniture arrives ready to use.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "See real prices and stock status upfront — no surprises, no pressure.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
