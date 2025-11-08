"use client";
import { useState } from "react";

interface MultipleChoicePuzzleProps {
  question: string;
  options: string[];
  onSubmit: (selected: string[]) => void;
  hint?: string;
  isCompleted: boolean;
  multiSelect?: boolean;
}

export default function MultipleChoicePuzzle({
  question,
  options,
  onSubmit,
  hint,
  isCompleted,
  multiSelect = true,
}: MultipleChoicePuzzleProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const toggleOption = (option: string) => {
    if (multiSelect) {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    } else {
      setSelected([option]);
    }
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onSubmit(selected.map((s) => s.toLowerCase()));
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
        {multiSelect && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Select all that apply
          </p>
        )}
        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition text-left font-medium ${
                selected.includes(option)
                  ? "border-blue-600 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-blue-400"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected.includes(option)
                      ? "border-blue-600 bg-blue-600"
                      : "border-zinc-400"
                  }`}
                >
                  {selected.includes(option) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </span>
                {option}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          Submit Answer
        </button>
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
