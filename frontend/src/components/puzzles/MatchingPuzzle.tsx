"use client";
import { useState, useEffect } from "react";

interface MatchingPuzzleProps {
  question: string;
  pairs: Array<{ person: string; position: string }>;
  onSubmit: (matches: string[]) => void;
  hint?: string;
  isCompleted: boolean;
}

export default function MatchingPuzzle({
  question,
  pairs,
  onSubmit,
  hint,
  isCompleted,
}: MatchingPuzzleProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [shuffledPositions, setShuffledPositions] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle positions on mount
    const positions = pairs.map((p) => p.position);
    setShuffledPositions(positions.sort(() => Math.random() - 0.5));
  }, [pairs]);

  const handleMatch = (person: string, position: string) => {
    setMatches((prev) => ({
      ...prev,
      [person]: position,
    }));
  };

  const handleSubmit = () => {
    const matchArray = Object.entries(matches).map(
      ([person, position]) => `${person}:${position}`
    );
    onSubmit(matchArray);
  };

  const allMatched = pairs.every((pair) => matches[pair.person]);

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
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Match each person to their correct position
        </p>

        <div className="space-y-4">
          {pairs.map((pair) => (
            <div
              key={pair.person}
              className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-300 dark:border-zinc-700"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {pair.person}
              </p>
              <select
                value={matches[pair.person] || ""}
                onChange={(e) => handleMatch(pair.person, e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a position...</option>
                {shuffledPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
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
