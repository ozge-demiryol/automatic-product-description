"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { FAQ } from "@/types/faq";

export default function FaqPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      const fetchFaqs = async () => {
        const response = await fetch(`/api/products/${selectedProduct}/faq`);
        const data = await response.json();
        setFaqs(data);
      };
      fetchFaqs();
    }
  }, [selectedProduct]);

  const handleAddFaq = async () => {
    const response = await fetch(`/api/products/${selectedProduct}/faq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFaq),
    });
    if (response.ok) {
      const addedFaq = await response.json();
      setFaqs([...faqs, addedFaq]);
      setNewFaq({ question: "", answer: "" });
    }
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq) return;
    const response = await fetch(`/api/products/${editingFaq._id}/faq`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: editingFaq.question,
        answer: editingFaq.answer,
      }),
    });

    if (response.ok) {
      setFaqs(
        faqs.map((faq) => (faq._id === editingFaq._id ? editingFaq : faq))
      );
      setEditingFaq(null);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-400">
            Ürün SSS Yönetimi
          </h1>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-400">Bir Ürün Seçin</h2>
                <select
                  id="product-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                >
                  <option value="">-- Bir Ürün Seçin --</option>
                  {products.map((product) => (
                    <option
                      key={product._id?.toString()}
                      value={product._id?.toString()}
                    >
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              {selectedProduct ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-400">SSSleri Yönet</h2>
                    <div className="p-6 rounded-lg shadow space-y-4">
                      {faqs.length === 0 ? (
                        <p className="text-gray-500">Bu ürün için henüz SSS bulunmamaktadır.</p>
                      ) : (
                        faqs.map((faq) => (
                          <div key={faq._id.toString()} className="p-4 border border-gray-800 rounded-lg">
                            {editingFaq && editingFaq._id === faq._id ? (
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  value={editingFaq.question}
                                  onChange={(e) =>
                                    setEditingFaq({
                                      ...editingFaq,
                                      question: e.target.value,
                                    })
                                  }
                                  className="w-full p-3 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <textarea
                                  value={editingFaq.answer}
                                  onChange={(e) =>
                                    setEditingFaq({
                                      ...editingFaq,
                                      answer: e.target.value,
                                    })
                                  }
                                  className="w-full p-3 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                  rows={4}
                                />
                                <div className="flex justify-end space-x-3">
                                  <button onClick={handleUpdateFaq} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Kaydet
                                  </button>
                                  <button onClick={() => setEditingFaq(null)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    İptal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-300">{faq.question}</h3>
                                  <p className="mt-1 text-gray-400">{faq.answer}</p>
                                </div>
                                <button onClick={() => setEditingFaq(faq)} className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                  Düzenle
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-gray-800">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-400">Yeni SSS Ekle</h2>
                    <div className="p-6 rounded-lg shadow space-y-4">
                      <input
                        type="text"
                        placeholder="Soru"
                        value={newFaq.question}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, question: e.target.value })
                        }
                        className="w-full p-3 border border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <textarea
                        placeholder="Cevap"
                        value={newFaq.answer}
                        onChange={(e) =>
                          setNewFaq({ ...newFaq, answer: e.target.value })
                        }
                        className="w-full p-3 border border-gray-800 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <button onClick={handleAddFaq} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          SSS Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">SSSleri görmek için lütfen bir ürün seçin.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

