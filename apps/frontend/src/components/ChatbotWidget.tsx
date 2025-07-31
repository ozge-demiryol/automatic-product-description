'use client';

import { useChat } from 'ai/react';
import React, { useState, useEffect } from 'react';
import { Message } from 'ai';
import { MessageSquare, X } from 'lucide-react';

interface ChatbotWidgetProps {
  productId?: string;
  initialMessage?: string;
  sellerId?: string;
}

export default function ChatbotWidget({ productId, initialMessage, sellerId }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const apiEndpoint = process.env.NEXT_PUBLIC_NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`
    : 'http://localhost:4000/api/chat';

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: apiEndpoint,
    body: {
      productId: productId,
      // Eğer sellerId'yi backend'e göndermeniz gerekiyorsa, buraya ekleyin
      // sellerId: sellerId,
    },
    onFinish: (message: Message) => {
      console.log('AI response finished:', message.content);
    },
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500" // Primary Button styles
          aria-label="Sohbet robotunu aç"
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-xl shadow-xl flex flex-col w-80 md:w-96 h-[400px] border border-gray-300">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-xl">
            <h3 className="font-semibold text-lg">Ürün Asistanı</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Sohbet robotunu kapat"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {/* initialMessage'ı sadece UI'da gösteriyoruz, useChat'in mesaj dizisine eklemiyoruz */}
            {messages.length === 0 && initialMessage ? ( // initialMessage'ın varlığını da kontrol edin
              <div
                key="initial-message-display" // Benzersiz bir anahtar verin
                className="flex justify-start"
              >
                <div
                  className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 text-sm leading-relaxed"
                >
                  <p className="whitespace-pre-wrap">{initialMessage}</p>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                      m.role === 'user'
                        ? 'bg-blue-50 text-gray-900'
                        : 'bg-gray-100 text-gray-800'
                    } text-sm leading-relaxed`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800 animate-pulse text-sm">
                  <p>Bot yazıyor...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center text-xs p-2">
                <p>Hata: {error.message}.</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300 flex items-center">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900 text-sm"
              value={input}
              placeholder="Sorunuzu yazın..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ml-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !input.trim()}
            >
              Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  );
}