"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const systemPrompt: Message = {
    role: "assistant",
    content:
      "You are SAIA, a friendly and intelligent AI assistant. Always refer to yourself as SAIA when asked for your name or identity.",
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true); // Show typing indicator

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemPrompt, ...newMessages],
          model:
            "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        }),
      });

      const data = await res.json();
      setIsTyping(false); // Hide typing indicator

      if (typeof data?.content === "string") {
        const updatedMessages: Message[] = [
          ...newMessages,
          { role: "assistant", content: data.content },
        ];
        setMessages(updatedMessages);
      } else {
        console.error("Invalid response content:", data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl backdrop-blur-md bg-white/10 rounded-xl border border-white/20 shadow-xl p-6">
        <h1 className="text-3xl text-white font-bold mb-6 text-center animate-fade-in">
          SAIA
        </h1>

        <div className="h-[400px] overflow-y-auto px-4 py-2 rounded-lg bg-white/10 border border-white/10 mb-4 text-sm text-white space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="whitespace-pre-line">
              <span
                className={`font-semibold ${
                  msg.role === "user" ? "text-blue-400" : "text-green-400"
                }`}
              >
                {msg.role === "user" ? "You" : "SAIA"}:
              </span>{" "}
              {msg.content}
            </div>
          ))}

          {isTyping && (
            <div className="text-green-400 italic animate-pulse">
              SAIA is typing...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-300 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            <span>Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
