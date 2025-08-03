import React from "react";
import Link from "next/link";
import ChatbotWidget from "@/app/components/ChatbotWidget";
import { FinalProductSave } from "@/types/product";
import Image from "next/image";

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = await params;

  let product: FinalProductSave | null = null;

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${apiBaseUrl}/api/products/${productId}`, {
      cache: "no-store", // Ensures data is re-fetched on every request
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Ürün bulunamadı: ${productId}`);
      } else {
        throw new Error(
          `Ürün detayları yüklenirken bir hata oluştu: ${res.statusText}`
        );
      }
    } else {
      product = await res.json();
    }
  } catch (error) {
    console.error(`Ürün detayları çekilirken hata oluştu:`, error);
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          Ürün bulunamadı.
        </h1>
        <p className="text-base text-gray-500 mb-6">
          Aradığınız ürün mevcut olmayabilir veya bir hata oluştu.
        </p>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-base font-medium"
        >
          &larr; Tüm Ürünlere Geri Dön
        </Link>
      </div>
    );
  }

  const initialBotMessage = `Merhaba! Bu ${product.name} ürünü hakkında size nasıl yardımcı olabilirim?`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block text-base font-medium"
      >
        &larr; Tüm Ürünlere Geri Dön
      </Link>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-sm"
          />
        )}

        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          {product.name}
        </h1>
        <p className="text-xl font-medium text-blue-600 mb-4">
          ${product.price?.toFixed(2)}
        </p>
        <p className="text-base text-gray-800 leading-relaxed mb-6">
          {product.description}
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition">
          Sepete Ekle
        </button>
      </div>
      <ChatbotWidget productId={productId} initialMessage={initialBotMessage} />
    </div>
  );
}
