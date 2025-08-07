"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free", // Explicit model
        }),
      });

      const data = await res.json();

      if (data?.content) {
        const updatedMessages: Message[] = [
          ...newMessages,
          { role: "assistant", content: data.content },
        ];
        setMessages(updatedMessages);
      } else {
        console.error("No response content:", data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SAIA</h1>
      <div className="border rounded p-4 h-[400px] overflow-y-auto bg-white shadow mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span
              className={
                msg.role === "user"
                  ? "text-blue-600 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {msg.role}:
            </span>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-grow border rounded px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
}
