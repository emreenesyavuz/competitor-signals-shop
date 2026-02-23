import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Sneakers",
    description: "Clean, minimalist sneakers crafted from premium leather. Perfect for everyday wear.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    category: "Footwear",
  },
  {
    id: "2",
    name: "Wireless Noise-Canceling Headphones",
    description: "Immersive sound with 30-hour battery life and adaptive noise cancellation.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Sustainably made, ultra-soft tee in a relaxed fit. Available in earth tones.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    category: "Apparel",
  },
  {
    id: "4",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Hand-glazed dripper and carafe for the perfect slow-brewed cup every morning.",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    category: "Home",
  },
  {
    id: "5",
    name: "Leather Weekender Bag",
    description: "Full-grain leather duffle with brass hardware. Fits carry-on requirements.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    category: "Accessories",
  },
  {
    id: "6",
    name: "Smart Fitness Watch",
    description: "Track workouts, heart rate, and sleep. Water-resistant with 7-day battery.",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    category: "Electronics",
  },
  {
    id: "7",
    name: "Scented Soy Candle Set",
    description: "Three hand-poured candles in cedar, lavender, and vanilla. 40-hour burn time each.",
    price: 42.99,
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    category: "Home",
  },
  {
    id: "8",
    name: "Polarized Sunglasses",
    description: "Lightweight acetate frames with UV400 protection and anti-glare lenses.",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    category: "Accessories",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
