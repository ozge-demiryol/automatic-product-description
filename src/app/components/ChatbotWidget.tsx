"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  productId?: string;
  initialMessage?: string;
  sellerId?: string;
}

export default function Chatbot({
  productId,
  initialMessage,
  sellerId,
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiBaseUrl = process.env.VERCEL_URL
    ? process.env.VERCEL_URL
    : process.env.NEXT_PUBLIC_BASE_URL;

  const apiEndpoint = `${apiBaseUrl}/api/chat`;

  // Mesajlar güncellenince scroll otomatik en alta
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // İlk açılışta başlangıç mesajı ekle
  useEffect(() => {
    if (messages.length === 0 && initialMessage) {
      setMessages([
        {
          id: "init",
          role: "assistant",
          content: initialMessage,
        },
      ]);
    }
  }, [initialMessage, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          productId,
          sellerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Ağ bağlantısı sağlanamadı");
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || data.message || "Yanıt alınamadı.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-label="Ürün chat asistanı"
      className="flex flex-col bg-white rounded-xl shadow-lg border border-gray-300 p-4 max-h-[600px] md:max-h-[700px] overflow-hidden"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        Ürün Asistanı
      </h2>

      <div
        className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500">Mesaj yok</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                  m.role === "user"
                    ? "bg-blue-50 text-gray-900"
                    : "bg-gray-100 text-gray-800"
                } text-sm leading-relaxed break-words whitespace-pre-wrap`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 animate-pulse text-sm">
              Bot yazıyor...
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center text-xs p-2" role="alert">
            Hata: {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-gray-300 pt-2"
        aria-label="Chat mesaj gönderme formu"
      >
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
          placeholder="Sorunuzu yazın..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          aria-label="Mesaj metni"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !input.trim()}
          aria-disabled={isLoading || !input.trim()}
          aria-label="Mesaj gönder"
        >
          Gönder
        </button>
      </form>
    </section>
  );
}
