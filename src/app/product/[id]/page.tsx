"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProduct } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { useTrackPageView } from "@/lib/useTrackPageView";
import { trackEvent } from "@/lib/tracking";

export default function ProductPage() {
  const params = useParams();
  const product = getProduct(params.id as string);
  const { addToCart } = useCart();

  useTrackPageView(
    product
      ? {
          eventName: "ViewContent",
          data: {
            content_ids: [product.id],
            content_name: product.name,
            content_category: product.category,
            content_type: "product",
            value: product.price,
            currency: "USD",
          },
        }
      : undefined
  );

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        <Link href="/" className="mt-4 text-indigo-600 hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="flex flex-col justify-center">
        <span className="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-600">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          {product.description}
        </p>
        <p className="mt-6 text-3xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>

        <div className="mt-8 flex gap-4">
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
            className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          >
            Add to Cart
          </button>
          <Link
            href="/cart"
            className="rounded-xl border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View Cart
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 text-sm text-indigo-600 hover:underline"
        >
          &larr; Continue Shopping
        </Link>
      </div>
    </div>
  );
}
