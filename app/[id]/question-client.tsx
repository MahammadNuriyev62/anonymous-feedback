"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Question {
  _id: string;
  question: string;
}

interface Feedback {
  _id: string;
  feedback: string;
  question_id: string;
  createdAt: string;
}

interface Props {
  questionId: string;
  initialQuestion: Question | null;
  initialError: string;
}

export default function QuestionClient({
  questionId,
  initialQuestion,
  initialError,
}: Props) {
  const [question] = useState<Question | null>(initialQuestion);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error] = useState(initialError);

  useEffect(() => {
    if (question) {
      fetchFeedbacks();
    }
  }, [question]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`/api/feedbacks/${questionId}`);
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: newFeedback.trim(),
          question_id: questionId,
        }),
      });

      if (response.ok) {
        setNewFeedback("");
        fetchFeedbacks(); // Refresh feedbacks
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (error || !question) {
    return (
      <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-6">
            {error || "Question not found"}
          </h1>
          <Link href="/" className="openai-button px-6 py-3 inline-block">
            Create New Question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {question.question}
            </h1>
            <button
              onClick={copyToClipboard}
              className="openai-button-secondary px-4 py-2 text-sm"
            >
              <svg
                className="w-4 h-4 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy link
            </button>
          </div>

          {/* Feedback Form */}
          <div className="openai-card p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Share your feedback
            </h2>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Your honest feedback is valuable. Share your thoughts anonymously..."
                className="openai-input w-full h-32 px-4 py-3 resize-none"
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {newFeedback.length}/1000
                </span>
                <button
                  type="submit"
                  disabled={!newFeedback.trim() || isSubmitting}
                  className="openai-button py-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit feedback"}
                </button>
              </div>
            </form>
          </div>

          {/* Feedbacks */}
          <div className="openai-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 text-white">
              Feedback ({feedbacks.length})
            </h2>

            {feedbacks.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg">No feedback yet</p>
                <p className="text-sm">Be the first to share your thoughts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="bg-[#2d2d42] rounded-lg p-4 md:p-6 border-l-4 border-[#10a37f]"
                  >
                    <p className="text-gray-100 leading-relaxed mb-3">
                      {feedback.feedback}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(feedback.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
