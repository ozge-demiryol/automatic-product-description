"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Ürünler yüklenirken hata oluştu: ${res.statusText}`);
      return [];
    }

    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        <p className="text-center text-gray-500 text-base mt-20">
          Yükleniyor...
        </p>
      </div>
    );
  }

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
              className="block focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-xl"
            >
              <div className="bg-gray-900 rounded-xl shadow-md p-4 border border-gray-800 hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer flex flex-col h-full">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="mt-auto flex justify-between items-center">
                  <span className="text-cyan-400 text-lg font-semibold">
                    {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-cyan-400 font-medium underline">
                    Detayları Gör
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
