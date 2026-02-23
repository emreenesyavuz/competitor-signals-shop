import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TrackPageView from "@/components/TrackPageView";

export default function HomePage() {
  return (
    <>
      <TrackPageView />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          All Products
        </h1>
        <p className="mt-2 text-gray-500">
          Browse our curated collection of premium essentials.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
