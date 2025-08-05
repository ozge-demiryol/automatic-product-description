"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Chatbot from "@/app/components/ChatbotWidget";
import { FinalProductSave } from "@/types/product";
import { useParams } from "next/navigation";

async function getProductById(
  productId: string
): Promise<FinalProductSave | null> {
  try {
    const res = await fetch(`/api/products/${productId}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Ürün bulunamadı: ${productId}`);
        return null;
      } else {
        throw new Error(`Ürün detayları yüklenirken hata: ${res.statusText}`);
      }
    }

    const product: FinalProductSave = await res.json();
    return product;
  } catch (error) {
    console.error("Ürün çekilirken hata oluştu:", error);
    return null;
  }
}

export default function ProductDetailPage() {
  const { productId } = useParams() as { productId: string };

  const [product, setProduct] = useState<FinalProductSave | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      const result = await getProductById(productId);

      if (!result) {
        setError("Ürün bulunamadı veya bir hata oluştu.");
      } else {
        setProduct(result);
      }

      setLoading(false);
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-lg">Yükleniyor...</p>
      </div>
    );
  }

  const initialBotMessage = `Merhaba! Bu ${product.name} ürünü hakkında size nasıl yardımcı olabilirim?`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-[80vh] flex flex-col gap-4">
      <Link
        href="/products"
        className="text-cyan-400 hover:underline mb-4 text-base font-medium"
      >
        &larr; Tüm Ürünlere Geri Dön
      </Link>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="md:w-1/2 bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 flex flex-col">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-3">
            {product.name}
          </h1>

          <p className="inline-block bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full font-semibold mb-4 text-lg w-fit">
            {product.price?.toFixed(2)}
          </p>
          {product.imageUrl && <img src={product.imageUrl} alt={""} width="auto" height="auto" />}
          <p
            className="text-gray-300 leading-relaxed text-sm md:text-base flex-grow overflow-auto mt-6"
            style={{ maxHeight: "300px" }}
          >
            {product.description}
          </p>

          <button className="mt-6 bg-cyan-400 hover:bg-cyan-500 text-white text-base font-medium px-6 py-3 rounded-lg shadow-sm transition w-full">
            Sepete Ekle
          </button>
        </div>

        <div className="md:w-1/2 bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-4 flex flex-col h-full">
          <Chatbot productId={productId} initialMessage={initialBotMessage} />
        </div>
      </div>
    </div>
  );
}
