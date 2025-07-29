'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// import { Loader2 } from 'lucide-react'; // Eğer lucide-react kuruluysa uncomment edin

interface ProductInput {
    name: string;
    category: string;
    tone: string;
    keywords: string[];
}

interface GeneratedDescriptionResponse {
    seoScore: number;
    productDescription: string;
    customerQuestions?: string[];
}

interface FinalProductSave {
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    category: string;
    keywords: string[];
}

export default function AddProductPage() {
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productTone, setProductTone] = useState('');
    const [keywordsInput, setKeywordsInput] = useState('');
    const [productImageUrl, setProductImageUrl] = useState('');
    const [productPrice, setProductPrice] = useState('');

    const [generatedDescription, setGeneratedDescription] = useState(''); // AI tarafından üretilen ham açıklama ve kullanıcı düzenlemeleri için
    const [displayDescription, setDisplayDescription] = useState('');     // Sadece yazım efekti sırasında gösterilen metin
    const [seoScore, setSeoScore] = useState<number | null>(null);
    const [customerQuestions, setCustomerQuestions] = useState<string[] | null>(null);

    const [isLoading, setIsLoading] = useState(false); // Tüm async işlemleri kapsayan genel loading
    const [isGenerating, setIsGenerating] = useState(false); // Sadece açıklama üretimi ve yazım efekti için loading
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const toneOptions = ['samimi', 'profesyonel', 'lüks', 'teknik'];

    const primaryBlue = 'blue-600';
    const primaryHover = 'blue-700';
    const lightBackground = 'blue-50';
    const grayText = 'gray-500';
    const borderGray = 'gray-300';
    const successGreen = 'green-500';
    const errorRed = 'red-500';
    const darkText = 'gray-900';

    const apiBaseUrl = process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_BASE_URL : "http://localhost:4000/api";
    const keywordsArray = keywordsInput.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    // Yazım efekti için useEffect
    useEffect(() => {
        if (generatedDescription && isGenerating) {
            let i = 0;
            // setDisplayDescription(''); // Her yeni üretimde sıfırla - başlangıçta zaten boş olacak
            const typingInterval = setInterval(() => {
                setDisplayDescription((prev) => prev + generatedDescription.charAt(i));
                i++;
                if (i === generatedDescription.length) {
                    clearInterval(typingInterval);
                    setIsGenerating(false); // Yazım bittiğinde false yap
                    if (descriptionRef.current) {
                        descriptionRef.current.scrollTop = descriptionRef.current.scrollHeight; // En alta kaydır
                    }
                }
            }, 20); // Her karakter arası gecikme (ms)
            return () => clearInterval(typingInterval);
        } else if (!generatedDescription && !isGenerating) {
            // Eğer açıklama yoksa ve yazım efekti aktif değilse, textarea'yı boşalt
            setDisplayDescription('');
        }
    }, [generatedDescription, isGenerating]);


    const handleGenerateDescription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setMessage(null);
        setGeneratedDescription(''); // Yeni üretim öncesi temizle
        setDisplayDescription('');   // Yazım efekti için de temizle
        setSeoScore(null);
        setCustomerQuestions(null);
        setIsLoading(true);
        setIsGenerating(true);

        if (!productName || !productCategory || !productTone || keywordsArray.length === 0) {
            setMessage({ type: 'error', text: 'Ürün adı, kategori, tonlama ve en az bir anahtar kelime zorunludur.' });
            setIsLoading(false);
            setIsGenerating(false);
            return;
        }

        const productDataForAI: ProductInput = {
            name: productName,
            category: productCategory,
            tone: productTone,
            keywords: keywordsArray
        };

        try {
            const res = await fetch(`${apiBaseUrl}/products/generate-description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productDataForAI),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Açıklama üretilirken bir hata oluştu: ${res.statusText}`);
            }

            const data: GeneratedDescriptionResponse = await res.json();
            setGeneratedDescription(data.productDescription); // Tam açıklamayı state'e kaydet
            setSeoScore(data.seoScore);
            setCustomerQuestions(data.customerQuestions || null);

            setMessage({ type: 'success', text: 'Ürün açıklaması başarıyla üretildi!' });

        } catch (error: any) {
            console.error('Açıklama üretilirken hata:', error);
            setMessage({ type: 'error', text: error.message || 'Açıklama üretilirken bilinmeyen bir hata oluştu.' });
            setIsGenerating(false); // Hata durumunda yazım efektini durdur
        } finally {
            setIsLoading(false); // Genel loading'i durdur
        }
    };

    const handleSaveProduct = async () => {
        setMessage(null);
        setIsLoading(true);

        const parsedPrice = parseFloat(productPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setMessage({ type: 'error', text: 'Geçerli bir fiyat giriniz.' });
            setIsLoading(false);
            return;
        }
        // Eğer açıklama alanı boşsa veya yazım efekti henüz bitmediyse kaydetmeyi engelle
        if (!generatedDescription || isGenerating) {
            setMessage({ type: 'error', text: 'Lütfen önce bir ürün açıklaması üretin ve yazım efektinin bitmesini bekleyin.' });
            setIsLoading(false);
            return;
        }

        const productToSave: FinalProductSave = {
            name: productName,
            price: parsedPrice,
            description: generatedDescription, // Kullanıcının düzenlediği nihai açıklama
            category: productCategory,
            keywords: keywordsArray,
            imageUrl: productImageUrl || undefined,
        };

        try {
            console.log("Kaydedilecek ürün açıklaması:", generatedDescription)
            const res = await fetch(`${apiBaseUrl}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToSave),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Ürün kaydedilirken bir hata oluştu: ${res.statusText}`);
            }

            setMessage({ type: 'success', text: 'Ürün başarıyla kaydedildi!' });
            // Formu sıfırla
            setProductName('');
            setProductCategory('');
            setProductTone('');
            setKeywordsInput('');
            setProductImageUrl('');
            setProductPrice('');
            setGeneratedDescription('');
            setDisplayDescription('');
            setSeoScore(null);
            setCustomerQuestions(null);

        } catch (error: any) {
            console.error('Ürün kaydedilirken hata:', error);
            setMessage({ type: 'error', text: error.message || 'Ürün kaydedilirken bilinmeyen bir hata oluştu.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Tüm formu sıfırla
        setProductName('');
        setProductCategory('');
        setProductTone('');
        setKeywordsInput('');
        setProductImageUrl('');
        setProductPrice('');
        setGeneratedDescription('');
        setDisplayDescription('');
        setSeoScore(null);
        setCustomerQuestions(null);
        setMessage(null);
        setIsLoading(false);
        setIsGenerating(false);
    };

    const handleCopyDescription = () => {
        if (displayDescription) {
            navigator.clipboard.writeText(displayDescription);
            setMessage({ type: 'success', text: 'Açıklama panoya kopyalandı!' });
        } else {
            setMessage({ type: 'error', text: 'Kopyalanacak bir açıklama yok.' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link href="/products" className={`text-${primaryBlue} hover:underline mb-6 inline-block text-base font-medium`}>
                &larr; Tüm Ürünlere Geri Dön
            </Link>

            <h1 className={`text-2xl font-semibold text-${darkText} mb-6`}>
                Yeni Ürün Ekle (Yapay Zeka Destekli Açıklama)
            </h1>

            <form onSubmit={handleGenerateDescription} className={`bg-white rounded-xl shadow-lg p-6 border border-${borderGray} space-y-4`}>

                {/* Mesaj Kutusu */}
                {message && (
                    <div
                        className={`px-4 py-2 rounded shadow text-sm font-medium ${message.type === 'success' ? `bg-${successGreen} text-white` : `bg-${errorRed} text-white`
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Ürün Bilgileri Giriş Alanları */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="productName" className={`text-sm text-${grayText}`}>Ürün Adı</label>
                    <input
                        id="productName"
                        type="text"
                        className={`border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 text-${darkText}`}
                        placeholder="Örn: Yeni Model Bluetooth Hoparlör"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="productCategory" className={`text-sm text-${grayText}`}>Kategori</label>
                    <input
                        id="productCategory"
                        type="text"
                        className={`border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 text-${darkText}`}
                        placeholder="Örn: Elektronik, Giyim, Ev Eşyası"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Tonlama Seçim Butonları */}
                <div className="flex flex-col gap-1">
                    <label className={`text-sm text-${grayText}`}>Tonlama</label>
                    <div className="flex gap-2 flex-wrap">
                        {toneOptions.map((tone) => (
                            <button
                                key={tone}
                                type="button"
                                onClick={() => setProductTone(tone)}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition
                                    ${productTone === tone
                                        ? `bg-${primaryBlue} text-white shadow`
                                        : `bg-gray-200 text-gray-800 hover:bg-gray-300`
                                    }
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                disabled={isLoading}
                            >
                                {tone.charAt(0).toUpperCase() + tone.slice(1)}
                            </button>
                        ))}
                    </div>
                    {!productTone && !isLoading && (
                        <p className={`text-${errorRed} text-xs mt-1`}>Lütfen bir tonlama seçiniz.</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="keywordsInput" className={`text-sm text-${grayText}`}>Anahtar Kelimeler / Kısa Açıklamalar (Virgülle Ayırın)</label>
                    <textarea
                        id="keywordsInput"
                        rows={3}
                        className={`border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 text-${darkText} resize-y`}
                        placeholder="Örn: suya dayanıklı, yüksek ses kalitesi, uzun pil ömrü, taşınabilir"
                        value={keywordsInput}
                        onChange={(e) => setKeywordsInput(e.target.value)}
                        required
                        disabled={isLoading}
                    ></textarea>
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="productImageUrl" className={`text-sm text-${grayText}`}>Görsel URL (İsteğe Bağlı)</label>
                    <input
                        id="productImageUrl"
                        type="url"
                        className={`border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 text-${darkText}`}
                        placeholder="Örn: https://example.com/resim.jpg"
                        value={productImageUrl}
                        onChange={(e) => setProductImageUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="productPrice" className={`text-sm text-${grayText}`}>Fiyat ($)</label>
                    <input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        className={`border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 text-${darkText}`}
                        placeholder="Örn: 99.99"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* AI Output Section - Formun içine taşındı */}
                <div className={`mt-4 pt-4 border-t border-${borderGray} space-y-4`}>
                    <h2 className={`text-${darkText} font-medium text-base mb-2`}>Ürün Açıklaması</h2>
                    <textarea
                        ref={descriptionRef}
                        className={`w-full bg-white text-${darkText} text-sm leading-relaxed border border-${borderGray} focus:border-${primaryBlue} focus:ring-${lightBackground} rounded-lg px-4 py-2 resize-y overflow-y-auto
                            ${(isGenerating || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                        rows={6}
                        // Yazım efekti bitince displayDescription'ı generatedDescription'a eşitle
                        value={isGenerating ? displayDescription : generatedDescription}
                        onChange={(e) => {
                            setGeneratedDescription(e.target.value); // Hem kaydedilecek veriyi güncelle
                            setDisplayDescription(e.target.value);     // Hem de görünen metni güncelle
                        }}
                        disabled={isGenerating || isLoading} // Üretilirken veya genel yüklemede disabled olsun
                    />
                    {isGenerating && (
                        <p className={`text-${grayText} text-sm mt-2`}>Yapay zeka açıklama oluşturuyor...</p>
                    )}

                    {/* Açıklama Üret Butonu */}
                <button
                    type="submit"
                    className={`w-full bg-${primaryBlue} hover:bg-${primaryHover} text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isLoading}
                >
                    {isLoading && isGenerating ? (
                        <>
                            {/* <Loader2 className="animate-spin inline-block mr-2" size={20} /> */}
                            Açıklama Üretiliyor...
                        </>
                    ) : 'Açıklama Üret'}
                </button>

                    {/* Sadece yazım efekti bittiğinde ve açıklama varsa göster */}
                    {generatedDescription && !isGenerating && (
                        <>
                            <div className="mt-3 flex justify-between items-center">
                                {seoScore !== null && (
                                    <span className={`text-${successGreen} text-xs font-medium`}>SEO Skoru: {seoScore}/100</span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleCopyDescription}
                                    className={`text-${primaryBlue} text-sm hover:underline`}
                                >
                                    Kopyala
                                </button>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={handleSaveProduct}
                                    className={`flex-1 bg-${primaryBlue} hover:bg-${primaryHover} text-white text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Ürün Kaydediliyor...' : 'Ürünü Kaydet'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={`flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-base font-medium px-5 py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                    disabled={isLoading}
                                >
                                    İptal
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}