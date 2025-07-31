"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FinalProductSave,
  Faq,
  GeneratedDescriptionResponse,
  SavedProductResponse,
} from "@/types/product";

export default function AddProductPage() {
  // Adım yönetimi için state
  const [currentStep, setCurrentStep] = useState(1); // 1: Ürün Detayları, 2: SSS Ekleme

  // 1. Adım State'leri (Ürün Bilgileri)
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productTone, setProductTone] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const [generatedDescription, setGeneratedDescription] = useState("");
  const [displayDescription, setDisplayDescription] = useState("");
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [customerQuestions, setCustomerQuestions] = useState<string[] | null>(
    null
  );

  // 2. Adım State'leri (SSS)
  const [savedProductId, setSavedProductId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [addedFaqs, setAddedFaqs] = useState<Faq[]>([]);
  const [isFaqLoading, setIsFaqLoading] = useState(false);

  // Genel State'ler
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const keywordsArray = keywordsInput
    .split(",")
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

  // Yazım efekti
  useEffect(() => {
    if (isGenerating && generatedDescription) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < generatedDescription.length) {
          setDisplayDescription(
            (prev) => prev + generatedDescription.charAt(i)
          );
          i++;
        } else {
          clearInterval(typingInterval);
          setIsGenerating(false);
        }
      }, 20);
      return () => clearInterval(typingInterval);
    }
  }, [generatedDescription, isGenerating]);

  // Fonksiyonlar
  const handleGenerateDescription = async () => {
    if (
      !productName ||
      !productCategory ||
      !productTone ||
      keywordsArray.length === 0
    ) {
      setMessage({
        type: "error",
        text: "Ürün adı, kategori, tonlama ve en az bir anahtar kelime zorunludur.",
      });
      return;
    }

    setMessage(null);
    setGeneratedDescription("");
    setDisplayDescription("");
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const res = await fetch(`api/products/generate-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          category: productCategory,
          tone: productTone,
          keywords: keywordsArray,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "API hatası");
      const data: GeneratedDescriptionResponse = await res.json();
      setGeneratedDescription(data.productDescription);
      setSeoScore(data.seoScore);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Açıklama üretilemedi: ${error.message}`,
      });
      setIsGenerating(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProductAndGoToNextStep = async () => {
    if (!generatedDescription || isGenerating) {
      setMessage({
        type: "error",
        text: "Lütfen önce açıklama üretin ve işlemin bitmesini bekleyin.",
      });
      return;
    }
    const parsedPrice = parseFloat(productPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage({ type: "error", text: "Geçerli bir fiyat giriniz." });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const productToSave: FinalProductSave = {
      name: productName,
      price: parsedPrice,
      description: generatedDescription,
      category: productCategory,
      keywords: keywordsArray,
      imageUrl: productImageUrl || undefined,
    };

    try {
      const res = await fetch(`${apiBaseUrl}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Ürün kaydedilemedi.");
      const savedProduct: SavedProductResponse = await res.json();
      setSavedProductId(savedProduct._id);
      setMessage({
        type: "success",
        text: "Ürün başarıyla kaydedildi! Şimdi SSS ekleyebilirsiniz.",
      });
      setCurrentStep(2); // Sonraki adıma geç
    } catch (error: any) {
      setMessage({
        type: "error",
        text: `Ürün kaydedilemedi: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) return;

    setIsFaqLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${apiBaseUrl}/products/${savedProductId}/faq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: faqQuestion, answer: faqAnswer }),
      });

      console.log(res);
      if (!res.ok)
        throw new Error((await res.json()).message || "SSS eklenemedi.");
      const newFaq = await res.json();
      setAddedFaqs((prev) => [...prev, newFaq]);
      setFaqQuestion("");
      setFaqAnswer("");
      setMessage({ type: "success", text: "SSS başarıyla eklendi!" });
    } catch (error: any) {
      setMessage({ type: "error", text: `SSS eklenemedi: ${error.message}` });
    } finally {
      setIsFaqLoading(false);
    }
  };

  const resetFormAndStartOver = () => {
    setCurrentStep(1);
    setProductName("");
    setProductCategory("");
    setProductTone("");
    setKeywordsInput("");
    setProductImageUrl("");
    setProductPrice("");
    setGeneratedDescription("");
    setDisplayDescription("");
    setSeoScore(null);
    setSavedProductId(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setAddedFaqs([]);
    setIsFaqLoading(false);
    setMessage(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/products"
        className="text-blue-600 hover:underline mb-6 inline-block text-base font-medium"
      >
        &larr; Tüm Ürünlere Geri Dön
      </Link>

      <h1 className="text-2xl font-semibold text-white-900 mb-2">
        Yeni Ürün Ekle
      </h1>
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out ${currentStep === 1 ? "w-1/2" : "w-full"}`}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium">
          <span
            className={currentStep >= 1 ? "text-blue-600" : "text-gray-500"}
          >
            Ürün Detayları
          </span>
          <span
            className={currentStep >= 2 ? "text-blue-600" : "text-gray-500"}
          >
            SSS Ekleme
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg shadow text-sm font-medium mb-4 text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {message.text}
        </div>
      )}

      {/* Adım 1: Ürün Detayları */}
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 space-y-5">
          {/* Form Alanları */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productName" className="text-sm text-gray-600">
                Ürün Adı
              </label>
              <input
                id="productName"
                type="text"
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2"
                placeholder="Örn: Yeni Model Bluetooth Hoparlör"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="productCategory"
                className="text-sm text-gray-600"
              >
                Kategori
              </label>
              <input
                id="productCategory"
                type="text"
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2"
                placeholder="Örn: Elektronik"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="productPrice" className="text-sm text-gray-600">
                Fiyat (₺)
              </label>
              <input
                id="productPrice"
                type="number"
                step="0.01"
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2"
                placeholder="Örn: 499.90"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="productImageUrl"
                className="text-sm text-gray-600"
              >
                Görsel URL (İsteğe Bağlı)
              </label>
              <input
                id="productImageUrl"
                type="url"
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2"
                placeholder="https://..."
                value={productImageUrl}
                onChange={(e) => setProductImageUrl(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Tonlama</label>
            <div className="flex gap-2 flex-wrap mt-1">
              {["Samimi", "Profesyonel", "Lüks", "Teknik"].map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setProductTone(tone.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${productTone === tone.toLowerCase() ? "bg-blue-600 text-white shadow" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="keywordsInput" className="text-sm text-gray-600">
              Anahtar Kelimeler / Kısa Açıklamalar (Virgülle ayırın)
            </label>
            <textarea
              id="keywordsInput"
              rows={3}
              className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2 resize-y"
              placeholder="suya dayanıklı, yüksek ses kalitesi, uzun pil ömrü"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateDescription}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isGenerating
              ? "Açıklama Üretiliyor..."
              : "Yapay Zeka ile Açıklama Oluştur"}
          </button>

          {/* AI Çıktı Kartı */}
          {
            <div className="py-4 space-y-3">
              <h2 className="text-gray-900 font-medium text-base">
                Ürün Açıklaması
              </h2>
              <textarea
                ref={descriptionRef}
                className="w-full bg-white text-gray-700 text-sm leading-relaxed border border-gray-300 rounded-lg px-4 py-2 resize-y"
                rows={8}
                value={displayDescription}
                onChange={(e) => setDisplayDescription(e.target.value)}
                disabled={isGenerating}
              />

              {!isGenerating && (
                <button
                  type="button"
                  onClick={handleSaveProductAndGoToNextStep}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Kaydediliyor..."
                    : "Ürünü Kaydet ve SSS Adımına Geç"}
                </button>
              )}
            </div>
          }
        </div>
      </div>

      {/* Adım 2: SSS Ekleme */}
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
          <h3 className="text-lg font-semibold text-gray-900">
            Ürün: `${productName}`
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Bu ürüne sıkça sorulan soruları ve cevaplarını ekleyin.
          </p>

          <form onSubmit={handleAddFaq} className="space-y-4">
            <div>
              <label htmlFor="faqQuestion" className="text-sm text-gray-600">
                Soru
              </label>
              <input
                id="faqQuestion"
                type="text"
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
                placeholder="Örn: Garanti süresi ne kadar?"
              />
            </div>
            <div>
              <label htmlFor="faqAnswer" className="text-sm text-gray-600">
                Cevap
              </label>
              <textarea
                id="faqAnswer"
                rows={3}
                className="w-full mt-1 border border-gray-300 text-gray-700 placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-100 rounded-lg px-4 py-2 resize-y"
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                placeholder="Örn: Tüm ürünlerimiz 2 yıl garantilidir."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
              disabled={isFaqLoading}
            >
              {isFaqLoading ? "Ekleniyor..." : "SSS Ekle"}
            </button>
          </form>

          {addedFaqs.length > 0 && (
            <div className="mt-6 border-t border-gray-300 pt-4">
              <h4 className="text-base font-medium text-gray-800 mb-3">
                Eklenen Sorular
              </h4>
              <ul className="space-y-3">
                {addedFaqs.map((faq, index) => (
                  <li key={index} className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-semibold text-sm text-gray-900">
                      {faq.question}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-gray-300 pt-4 flex justify-end">
            <button
              onClick={resetFormAndStartOver}
              className="bg-gray-800 hover:bg-gray-900 text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
            >
              Tamamla ve Yeni Ürün Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
