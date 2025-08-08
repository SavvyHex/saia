"use client";

import MatrixBackground from "./components/matrix-background";

export default function HomePage() {
  return (
    <>
      <MatrixBackground />
      <main className="fixed inset-0 flex items-center justify-center z-10">
        <div className="backdrop-blur-md bg-black/50 rounded-xl p-8 text-white w-[90%] max-w-md text-center border border-green-400/30 shadow-lg">
          <h1 className="text-6xl font-bold">SAIA</h1>
          <p className="mt-2 italic">
            Saketh's Artificially Intelligent Assistant
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => (window.location.href = "/chat")}
              className="mt-6 px-5 py-3 bg-green-500 text-black font-mono font-semibold rounded flex items-center gap-2 transition-all duration-300 glow-on-hover fade-in shadow-lg"
            >
              <span>Go to Chat</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
