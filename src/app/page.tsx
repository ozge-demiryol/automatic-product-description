// import React from "react";
// import Link from "next/link";
// import SettingsMenu from "@/app/components/SettingsMenu";

export const dynamic = 'force-dynamic';
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   imageUrl?: string;
// }

// async function getProducts(): Promise<Product[]> {
//   try {
//     const apiBaseUrl = process.env.VERCEL_URL
//     ? `https://${process.env.VERCEL_URL}`
//     : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//     const res = await fetch(`${apiBaseUrl}/api/products`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error(`Ürünler yüklenirken bir hata oluştu: ${res.statusText}`);
//     }

//     const products: Product[] = await res.json();
//     return products;
//   } catch (error) {
//     console.error("Ürünler çekilirken hata oluştu:", error);
//     return [];
//   }
// }

// export default async function ProductsPage() {
//   const products = await getProducts();

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-300">Ürün Listesi</h1>
//         <SettingsMenu />
//       </div>

//       {products.length === 0 ? (
//         <p className="text-gray-500 text-base">
//           Şu anda görüntülenecek ürün bulunmamaktadır.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map((product) => (
//             <Link
//               key={product._id}
//               href={`products/${product._id}`}
//               className="block"
//             >
//               {" "}
//               {/* */}
//               <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-300 hover:shadow-md transition-shadow cursor-pointer">
//                 <h2 className="text-base font-medium text-gray-900 mb-2">
//                   {product.name}
//                 </h2>
//                 <p className="text-sm text-gray-800 leading-relaxed mb-3 line-clamp-3">
//                   {product.description}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-blue-600 text-base font-medium">
//                     ${product.price?.toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// app/page.tsx
"use client";

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
