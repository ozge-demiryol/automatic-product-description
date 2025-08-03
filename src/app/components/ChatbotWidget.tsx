'use client';

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotWidgetProps {
  productId?: string;
  initialMessage?: string;
  sellerId?: string;
}

export default function ChatbotWidget({ productId, initialMessage, sellerId }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";;

  const apiEndpoint = `${apiBaseUrl}/api/chat`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          productId,
          sellerId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.message || 'No response'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Sohbet robotunu aç"
        >
          <MessageSquare className="h-8 w-8" />
        </button>
      )}

      {isOpen && (
        <div className="bg-gray-900 rounded-xl shadow-xl flex flex-col w-80 md:w-96 h-[400px] border border-gray-800">
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
            {messages.length === 0 && initialMessage ? (
              <div className="flex justify-start">
                <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-gray-800 text-gray-100 text-sm leading-relaxed">
                  <p className="whitespace-pre-wrap">{initialMessage}</p>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow-sm ${m.role === 'user'
                      ? 'bg-blue-100 text-gray-900'
                      : 'bg-gray-800 text-gray-200'
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
                <p>Hata: {error}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex items-center">
            <input
              className="flex-1 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-200 text-sm"
              value={input}
              placeholder="Sorunuzu yazın..."
              onChange={(e) => setInput(e.target.value)}
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