import React from "react";
import Link from "next/link";
import SettingsMenu from "@/app/components/SettingsMenu";

export const dynamic = 'force-dynamic';
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch("/api/products");

    if (!res.ok) {
      console.error(`Ürünler yüklenirken bir hata oluştu: ${res.statusText}`);
    }

    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-300">Ürün Listesi</h1>
        <SettingsMenu />
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-base">
          Şu anda görüntülenecek ürün bulunmamaktadır.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`products/${product._id}`}
              className="block"
            >
              {" "}
              {/* */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-300 hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-base font-medium text-gray-900 mb-2">
                  {product.name}
                </h2>
                <p className="text-sm text-gray-800 leading-relaxed mb-3 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 text-base font-medium">
                    ${product.price?.toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
