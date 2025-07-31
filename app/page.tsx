"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/${data.id}`);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Anonymous Feedback
            </h1>
            <p className="text-md md:text-md text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Create questions and collect honest, anonymous feedback from
              anyone
            </p>
          </div>

          {/* Main Form */}
          <div className="openai-card p-4 md:p-4 max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
              What do you want to know?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-left">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything you'd like honest feedback on..."
                  className="openai-input w-full h-32 md:h-40 px-4 py-3 text-lg resize-none"
                  maxLength={500}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span></span>
                  <span>{question.length}/500</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="openai-button w-full py-4 px-8 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating question...
                  </div>
                ) : (
                  "Create & Share Question"
                )}
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#10a37f] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Anonymous</h3>
              <p className="text-gray-400">
                No sign-up required. Complete privacy for respondents.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#10a37f] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant</h3>
              <p className="text-gray-400">
                Get your shareable link immediately and start collecting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#10a37f] rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Shareable</h3>
              <p className="text-gray-400">
                Easy sharing across all platforms and social media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
