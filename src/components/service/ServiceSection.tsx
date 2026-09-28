"use client";

import ServiceCard from "./ServiceCard";
import type { ServicePackage } from "@/types/service";
import { useCart } from "@/context/CartContext";

interface Props {
  id: string;
  title: string;
  services: ServicePackage[];
  onAdd: (service: ServicePackage) => void;
  onViewDetails: (service: ServicePackage) => void;
}

export default function ServiceSection({
  id,
  title,
  services,
  onAdd,
  onViewDetails,
}: Props) {
  const { items, increase, decrease } = useCart();

  return (
    <section id={id} className="scroll-mt-24 py-6">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {title}
        </h2>

        <div className="space-y-6">
          {services.map((service) => {
            const startingPrice =
              service.variants.length > 0
                ? Math.min(...service.variants.map((v) => v.price))
                : 0;

            const originalPrice = service.variants[0]?.originalPrice;

            /* 1. Find all active cart items for this service */
            const cartItemsForService = items.filter(
              (item) =>
                item.id === service.id ||
                item.id.startsWith(`${service.id}-`)
            );

            /* 2. Calculate total quantity across all variants */
            const totalQuantity = cartItemsForService.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            /* 3. Extract human-readable label for selected options */
            let selectedVariantName: string | undefined;
            if (cartItemsForService.length === 1) {
              const match = cartItemsForService[0].title.match(/\(([^)]+)\)/);
              selectedVariantName = match ? match[1] : undefined;
            } else if (cartItemsForService.length > 1) {
              selectedVariantName = `${cartItemsForService.length} options`;
            }

            return (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                rating={service.rating}
                reviews={service.reviews}
                description={service.description}
                duration={service.duration}
                price={startingPrice}
                originalPrice={originalPrice}
                image={service.image}
                optionsCount={service.variants.length}
                /* DYNAMIC CART STATES */
                quantity={totalQuantity}
                selectedVariantName={selectedVariantName}
                onOpenOptions={() => onAdd(service)}
                onAdd={() => onAdd(service)}
                onIncrease={() => {
                  if (cartItemsForService.length > 0) {
                    increase(cartItemsForService[0].id);
                  } else {
                    onAdd(service);
                  }
                }}
                onDecrease={() => {
                  if (cartItemsForService.length > 0) {
                    decrease(cartItemsForService[0].id);
                  }
                }}
                onViewDetails={() => onViewDetails(service)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}