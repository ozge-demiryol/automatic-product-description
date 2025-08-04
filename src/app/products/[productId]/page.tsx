"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Chatbot from "@/app/components/ChatbotWidget";
import { FinalProductSave } from "@/types/product";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.productId as string;

  const [product, setProduct] = useState<FinalProductSave | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Ürün bulunamadı.");
          } else {
            throw new Error(`Hata: ${res.statusText}`);
          }
        } else {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    };

    fetchProduct();
  }, [productId]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">{error}</h1>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-base font-medium"
        >
          &larr; Tüm Ürünlere Geri Dön
        </Link>
      </div>
    );
  }

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
        className="text-blue-600 hover:underline mb-4 text-base font-medium"
      >
        &larr; Tüm Ürünlere Geri Dön
      </Link>

      <div className="flex flex-col md:flex-row gap-6 h-full">
        <div className="md:w-1/2 bg-white rounded-xl shadow-lg p-6 border border-gray-300 flex flex-col">
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

        <div className="md:w-1/2 bg-white rounded-xl shadow-lg border border-gray-300 p-4 flex flex-col min-h-[500px] max-h-[700px]">
          <Chatbot productId={productId} initialMessage={initialBotMessage} />
        </div>
      </div>
    </div>
  );
}
