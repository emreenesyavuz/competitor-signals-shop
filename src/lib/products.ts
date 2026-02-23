import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Sneakers",
    description: "Clean, minimalist sneakers crafted from premium leather. Perfect for everyday wear.",
    price: 89.99,
    image: "https://picsum.photos/seed/sneakers/600/600",
    category: "Footwear",
  },
  {
    id: "2",
    name: "Wireless Noise-Canceling Headphones",
    description: "Immersive sound with 30-hour battery life and adaptive noise cancellation.",
    price: 249.99,
    image: "https://picsum.photos/seed/headphones/600/600",
    category: "Electronics",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Sustainably made, ultra-soft tee in a relaxed fit. Available in earth tones.",
    price: 34.99,
    image: "https://picsum.photos/seed/tshirt/600/600",
    category: "Apparel",
  },
  {
    id: "4",
    name: "Ceramic Pour-Over Coffee Set",
    description: "Hand-glazed dripper and carafe for the perfect slow-brewed cup every morning.",
    price: 64.99,
    image: "https://picsum.photos/seed/coffee/600/600",
    category: "Home",
  },
  {
    id: "5",
    name: "Leather Weekender Bag",
    description: "Full-grain leather duffle with brass hardware. Fits carry-on requirements.",
    price: 199.99,
    image: "https://picsum.photos/seed/bag/600/600",
    category: "Accessories",
  },
  {
    id: "6",
    name: "Smart Fitness Watch",
    description: "Track workouts, heart rate, and sleep. Water-resistant with 7-day battery.",
    price: 179.99,
    image: "https://picsum.photos/seed/watch/600/600",
    category: "Electronics",
  },
  {
    id: "7",
    name: "Scented Soy Candle Set",
    description: "Three hand-poured candles in cedar, lavender, and vanilla. 40-hour burn time each.",
    price: 42.99,
    image: "https://picsum.photos/seed/candle/600/600",
    category: "Home",
  },
  {
    id: "8",
    name: "Polarized Sunglasses",
    description: "Lightweight acetate frames with UV400 protection and anti-glare lenses.",
    price: 119.99,
    image: "https://picsum.photos/seed/sunglasses/600/600",
    category: "Accessories",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
