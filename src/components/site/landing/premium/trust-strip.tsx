import { Hammer, ShieldCheck, Truck, MessageCircle } from "lucide-react";

const items = [
  { icon: Hammer, label: "Handcrafted materials" },
  { icon: ShieldCheck, label: "Workmanship guarantee" },
  { icon: Truck, label: "Home & office delivery" },
  { icon: MessageCircle, label: "Real people, real answers" },
];

export function TrustStrip() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 sm:justify-between sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-neutral-600">
            <Icon className="h-4 w-4 text-neutral-400" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
