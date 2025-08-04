import React from "react";
import Link from "next/link";
import Chatbot from "@/app/components/ChatbotWidget";
import { FinalProductSave } from "@/types/product";

export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  let product: FinalProductSave | null = null;

  try {
    const apiBaseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${apiBaseUrl}/api/products/${productId}`, {
      cache: "no-store",
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
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-[80vh] flex flex-col gap-4">
      <Link
        href="/products"
        className="text-blue-600 hover:underline mb-4 text-base font-medium"
      >
        &larr; Tüm Ürünlere Geri Dön
      </Link>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Ürün Bilgisi - Sol sütun */}
        <div className="md:w-1/3 bg-white rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            {product.name}
          </h1>

          <p className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold mb-4 text-lg w-fit">
            ${product.price?.toFixed(2)}
          </p>

          <p
            className="text-gray-800 leading-relaxed text-sm md:text-base flex-grow overflow-auto"
            style={{ maxHeight: "300px" }}
          >
            {product.description}
          </p>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-6 py-3 rounded-lg shadow-sm transition w-full">
            Sepete Ekle
          </button>
        </div>

        {/* Chat Alanı - Sağ sütun */}
        <div className="md:w-2/3 bg-white rounded-xl shadow-lg border border-gray-300 p-4 flex flex-col min-h-[500px] max-h-[700px]">
          <Chatbot productId={productId} initialMessage={initialBotMessage} />
        </div>
      </div>
    </div>
  );
}
