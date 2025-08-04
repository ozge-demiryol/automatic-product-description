"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { FaShoppingBasket } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import type { MouseEvent } from "react";

export default function HomePage(): JSX.Element {
  const router = useRouter();

  const handleCustomerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // alert(
    //   "Ürünlerideğerlendirme ve soru-cevap sayfası buraya entegre edilecek."
    // );
    router.push("/products");
  };

  const handleSellerClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // alert(
    //   "Satıcının ürün bilgilerini girip otomatik açıklama oluşturacağı alan buraya entegre edilecek."
    // );
    router.push("/products/add-product");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6 text-[var(--foreground)] font-sans">
      <h1 className="text-3xl font-bold mb-10">
        E-ticaret Yapay Zeka Platformu
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Müşteri Bölümü */}
        <section className="flex flex-col items-center bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow hover:shadow-md transition w-full">
          <button
            onClick={handleCustomerClick}
            className="flex flex-col items-center text-green-600 hover:text-green-700 focus:outline-none"
          >
            <FaShoppingBasket size={48} />
            <span className="text-xl font-semibold mt-4">Ürünleri Gör</span>
          </button>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
            Ürünleri yapay zeka ile değerlendirilebilir ve ürün hakkında chat
            yapabilirsiniz.
          </p>
        </section>

        {/* Satıcı Bölümü */}
        <section className="flex flex-col items-center bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow hover:shadow-md transition w-full">
          <button
            onClick={handleSellerClick}
            className="flex flex-col items-center text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            <MdPostAdd size={48} />
            <span className="text-xl font-semibold mt-4">Ürün Bilgisi Gir</span>
          </button>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-center">
            Gireceğiniz ürün bilgileri ile sistemin otomatik satış açıklaması
            oluşturmasını sağlayabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
}
