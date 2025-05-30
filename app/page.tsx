'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });
  
  return (
    <div className="bg-black min-h-screen">
      <div className="flex flex-col min-h-screen bg-[#121212] text-white px-4 pt-10 pb-32 max-w-2xl mx-auto">
        <div className="flex-1 space-y-6 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div className={`text-sm p-3 rounded-xl max-w-xl ${
                m.role === 'user' ? 'bg-[#3B3B3B] self-end text-white text-right ml-auto' : 'bg-[#2A2A2A] text-gray-300 self-start mr-auto'
              }`}>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">...</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] px-4 py-4 border-t border-gray-700"
        >
          <div className="flex items-center gap-2 border border-gray-600 bg-[#2D2D2D] rounded-full px-4 py-2 max-w-2xl mx-auto">
            <input
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              value={input}
              placeholder="Ask me anything about Ted..."
              onChange={handleInputChange}
            />
            <button type="submit" className="text-gray-400 hover:text-white">
              ⏎
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}