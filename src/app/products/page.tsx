import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
      : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${apiBaseUrl}/api/products`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(res)
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
    <div className="max-w-4xl mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-300">Ürün Listesi</h1>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 text-base mt-20">
          Henüz ürün eklenmedi. Lütfen daha sonra tekrar kontrol edin.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
            >
              <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer flex flex-col h-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="mt-auto flex justify-between items-center">
                  <span className="text-blue-600 text-lg font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-blue-500 font-medium underline">
                    Detayları Gör
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ana Sayfaya Dön Butonu */}
      <Link
        href="/"
        className="fixed top-6 left-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-blue-400 z-50"
        aria-label="Ana Sayfaya Dön"
      >
        <span className="hidden sm:inline font-semibold">Ana Sayfa</span>
      </Link>
    </div>
  );
}
