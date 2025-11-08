"use client";
import { useState } from "react";

interface TextInputPuzzleProps {
  question: string;
  onSubmit: (answer: string) => void;
  hint?: string;
  isCompleted: boolean;
}

export default function TextInputPuzzle({
  question,
  onSubmit,
  hint,
  isCompleted,
}: TextInputPuzzleProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim().toLowerCase());
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
        <p className="text-green-700 dark:text-green-300 text-lg font-semibold">
          ✅ Puzzle Completed!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
          {question}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Submit Answer
          </button>
        </form>
      </div>

      {hint && (
        <div className="text-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showHint ? "Hide Hint" : "💡 Need a hint?"}
          </button>
          {showHint && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 italic">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
