"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTrackPageView } from "@/lib/useTrackPageView";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const total = searchParams.get("total") || "0.00";

  useTrackPageView();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-10 w-10 text-green-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Thank you for your order!
      </h1>
      <p className="mt-3 text-lg text-gray-600">
        Your order of <span className="font-semibold">${total}</span> has been
        placed successfully.
      </p>
      <p className="mt-1 text-gray-500">
        A confirmation email has been sent (not really, this is a demo).
      </p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white px-8 py-6">
        <p className="text-sm text-gray-500">Order Number</p>
        <p className="mt-1 text-2xl font-bold tracking-wider text-gray-900">
          #SS-{Math.random().toString(36).substring(2, 8).toUpperCase()}
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
