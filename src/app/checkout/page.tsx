"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useTrackPageView } from "@/lib/useTrackPageView";
import { trackEvent } from "@/lib/tracking";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useTrackPageView({
    eventName: "InitiateCheckout",
    data: {
      value: totalPrice,
      currency: "USD",
      num_items: items.length,
    },
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1500));

    const form = e.currentTarget;
    const formData = new FormData(form);

    trackEvent({
      eventName: "Purchase",
      data: {
        value: totalPrice,
        currency: "USD",
        num_items: items.length,
        content_ids: items.map((i) => i.product.id),
      },
      userData: {
        email: formData.get("email") as string,
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
        country: "US",
      },
    });

    clearCart();
    router.push(`/thank-you?total=${totalPrice.toFixed(2)}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-gray-900">
            Contact Information
          </legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </fieldset>

        {/* Shipping */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-gray-900">
            Shipping Address
          </legend>
          <div className="mt-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              id="address"
              name="address"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                name="city"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                id="state"
                name="state"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                id="zip"
                name="zip"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Fake Payment */}
        <fieldset className="rounded-xl border border-gray-200 bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-gray-900">
            Payment (Demo)
          </legend>
          <div className="mt-2">
            <label htmlFor="card" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              id="card"
              name="card"
              placeholder="4242 4242 4242 4242"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                Expiry
              </label>
              <input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                id="cvc"
                name="cvc"
                placeholder="123"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </fieldset>

        {/* Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
