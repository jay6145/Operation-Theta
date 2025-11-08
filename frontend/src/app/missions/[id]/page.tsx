"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi, fetchApiAuthenticated } from "@/utils/api";
import { Mission } from "@/types/mission";
import { auth } from "@/firebase/config";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import TextInputPuzzle from "@/components/puzzles/TextInputPuzzle";
import MultipleChoicePuzzle from "@/components/puzzles/MultipleChoicePuzzle";
import MatchingPuzzle from "@/components/puzzles/MatchingPuzzle";

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (params.id) {
      fetchMission(params.id as string);
    }
  }, [params.id]);

  async function fetchMission(id: string) {
    try {
      const res = await fetchApi(`/missions/${id}`);
      const data = await res.json();
      setMission(data);
    } catch (error) {
      console.error("Error fetching mission:", error);
    } finally {
      setLoading(false);
    }
  }

  function validateAnswer(userAnswer: string | string[]): boolean {
    if (!mission?.answer) return false;

    const correctAnswer = mission.answer;

    // Handle array answers (multiple choice, matching)
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      // For matching, sort both arrays for comparison
      if (mission.puzzleType === "matching") {
        const sortedCorrect = [...correctAnswer].sort();
        const sortedUser = [...userAnswer].sort();
        return (
          sortedCorrect.length === sortedUser.length &&
          sortedCorrect.every((val, idx) => val === sortedUser[idx])
        );
      }
      // For multiple choice, check if all correct answers are selected
      return (
        correctAnswer.length === userAnswer.length &&
        correctAnswer.every((ans) => userAnswer.includes(ans.toLowerCase()))
      );
    }

    // Handle string answers (text input)
    if (typeof correctAnswer === "string" && typeof userAnswer === "string") {
      return correctAnswer.toLowerCase() === userAnswer.toLowerCase();
    }

    return false;
  }

  async function handlePuzzleSubmit(userAnswer: string | string[]) {
    if (!mission || !user) return;

    setError(null);
    setSuccessMessage(null);

    // Validate answer
    const isCorrect = validateAnswer(userAnswer);

    if (!isCorrect) {
      setError("❌ Incorrect answer. Try again!");
      return;
    }

    // If correct, mark mission as complete
    try {
      const res = await fetchApiAuthenticated(`/missions/${mission.id}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        setMission({
          ...mission,
          completedBy: [...mission.completedBy, user.email!],
        });
        setSuccessMessage("✅ Correct! Mission completed!");
      }
    } catch (error) {
      console.error("Error completing mission:", error);
      setError("Failed to mark mission as complete.");
    }
  }

  const isCompleted = user && mission?.completedBy?.includes(user.email!);

  function renderPuzzle() {
    if (!mission || !mission.puzzleType) return null;

    const commonProps = {
      question: mission.question || "",
      hint: mission.hint,
      isCompleted: !!isCompleted,
    };

    switch (mission.puzzleType) {
      case "textInput":
        return (
          <TextInputPuzzle
            {...commonProps}
            onSubmit={(answer) => handlePuzzleSubmit(answer)}
          />
        );

      case "multipleChoice":
        return (
          <MultipleChoicePuzzle
            {...commonProps}
            options={mission.options || []}
            onSubmit={(selected) => handlePuzzleSubmit(selected)}
          />
        );

      case "matching":
        return (
          <MatchingPuzzle
            {...commonProps}
            pairs={mission.pairs || []}
            onSubmit={(matches) => handlePuzzleSubmit(matches)}
          />
        );

      default:
        return null;
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-black dark:to-zinc-900">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-10">
          {loading ? (
            <LoadingSpinner />
          ) : mission ? (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-300 dark:border-zinc-700 p-8">
              <button
                onClick={() => router.back()}
                className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
              >
                ← Back to missions
              </button>

              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-black dark:text-white">
                  {mission.title}
                </h1>
                <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {mission.xp} XP
                </span>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase mb-6">
                {mission.category}
              </p>

              <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed mb-8">
                {mission.description}
              </p>

              {/* Render puzzle */}
              {renderPuzzle()}

              {/* Error/Success messages */}
              {error && (
                <div className="mt-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mt-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    {successMessage}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center">
              Mission not found.
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
