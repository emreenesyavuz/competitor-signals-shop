"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "./CartProvider";
import { trackEvent } from "@/lib/tracking";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium uppercase tracking-wider text-indigo-600">
          {product.category}
        </span>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 transition hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 flex-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => {
              addToCart(product);
              trackEvent({
                eventName: "AddToCart",
                data: {
                  content_ids: [product.id],
                  content_name: product.name,
                  content_type: "product",
                  value: product.price,
                  currency: "USD",
                },
              });
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
