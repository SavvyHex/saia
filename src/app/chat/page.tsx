"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import PulsingBackground from "../components/pulsating-background";

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
    <main className="min-h-screen bg-black bg-grid-green/[0.2] flex items-center justify-center p-4">
      <PulsingBackground />
      <div className="w-full max-w-4xl backdrop-blur-md bg-[#0d0d0d]/70 rounded-xl border border-green-400/20 shadow-2xl p-8 relative z-10">
        <h1 className="text-4xl text-green-400 font-mono font-bold mb-6 text-center animate-fade-in">
          SAIA
        </h1>

        <div className="h-[600px] overflow-y-auto px-6 py-4 rounded-lg bg-[#000000]/60 border border-green-400/10 mb-6 text-sm text-green-300 space-y-4 font-mono">
          {messages.map((msg, i) => (
            <div key={i} className="leading-relaxed">
              <span
                className={`font-bold ${
                  msg.role === "user" ? "text-green-400" : "text-lime-300"
                }`}
              >
                {msg.role === "user" ? "You" : "SAIA"}:
              </span>
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-3xl font-bold mt-4 mb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-2xl font-bold mt-3 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-semibold mt-2 mb-1"
                        {...props}
                      />
                    ),
                    code({ node, className, children, ...props }) {
                      const isBlock =
                        className && className.startsWith("language-");
                      return isBlock ? (
                        <pre className="bg-black text-green-400 p-3 rounded-lg overflow-x-auto">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-black text-green-400 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="text-lime-400 italic animate-pulse">
              SAIA is typing...
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            className="flex-grow bg-black/70 border border-green-400/30 rounded-lg px-4 py-3 text-green-200 placeholder-green-500 focus:outline-none font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-black font-bold px-5 py-3 rounded-lg transition font-mono"
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
