"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useTrackPageView } from "@/lib/useTrackPageView";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  useTrackPageView();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="mb-4 h-16 w-16 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some items and come back!</p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${product.id}`}
                      className="font-semibold text-gray-900 hover:text-indigo-600"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-sm text-red-500 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="mt-3 block text-center text-sm text-indigo-600 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
