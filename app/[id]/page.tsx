"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function QuestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchFeedbacks();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
      } else if (response.status === 404) {
        setError("Question not found");
      } else {
        setError("Failed to load question");
      }
    } catch (error) {
      setError("Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`/api/feedbacks/${id}`);
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
          question_id: id,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error}</h1>
          <Link
            href="/"
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Create New Question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            ← Create New Question
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {question.question}
          </h1>
          <button
            onClick={copyToClipboard}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            📋 Share This Question
          </button>
        </div>

        {/* Feedback Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Share Your Feedback
          </h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Your honest feedback is valuable. Share your thoughts anonymously..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:border-purple-500 focus:outline-none transition-colors duration-200 placeholder-gray-400"
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newFeedback.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={!newFeedback.trim() || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>

        {/* Feedbacks */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Community Feedback ({feedbacks.length})
          </h2>

          {feedbacks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">💭</div>
              <p className="text-lg">
                No feedback yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-gray-50 rounded-xl p-4 md:p-6 border-l-4 border-purple-500"
                >
                  <p className="text-gray-800 leading-relaxed mb-2">
                    {feedback.feedback}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
