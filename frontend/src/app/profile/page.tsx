"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  category?: string;
  puzzleType: "textInput" | "multipleChoice" | "matching";
  question: string;
  answer: string | string[];
  hint?: string;
  options?: string[];
  pairs?: Array<{ left: string; right: string }>;
  completedBy: string[];
}

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const user = auth.currentUser;

  useEffect(() => {
    if (params.id) {
      fetchMission(params.id as string);
    }
  }, [params.id]);

  async function fetchMission(id: string) {
    try {
      const res = await fetch(`/api/missions/${id}`);
      const data = await res.json();
      setMission(data);
    } catch (error) {
      console.error("Error fetching mission:", error);
    } finally {
      setLoading(false);
    }
  }

  function validateAnswer(userAns: string): boolean {
    if (!mission?.answer) return false;

    const correctAnswer = mission.answer;

    if (typeof correctAnswer === "string") {
      return correctAnswer.toLowerCase() === userAns.toLowerCase();
    }

    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(ans => ans.toLowerCase() === userAns.toLowerCase());
    }

    return false;
  }

  async function handleSubmit() {
    if (!mission || !user) return;

    setError(null);
    setSuccessMessage(null);

    const isCorrect = validateAnswer(userAnswer);

    if (!isCorrect) {
      setError("❌ Incorrect answer. Try again!");
      return;
    }

    // Mark mission as complete
    try {
      await setDoc(doc(db, "users", user.uid, "missions", mission.id), {
        completed: true,
        completedAt: new Date(),
        missionId: mission.id,
      });

      setMission({
        ...mission,
        completedBy: [...mission.completedBy, user.email!],
      });
      setSuccessMessage("✅ Correct! Mission completed! You earned " + mission.xp + " XP!");
    } catch (error) {
      console.error("Error completing mission:", error);
      setError("Failed to mark mission as complete.");
    }
  }

  const isCompleted = user && mission?.completedBy?.includes(user.email!);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading mission...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Mission Not Found</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-yellow-400 hover:text-yellow-300 mb-6"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-gray-900 rounded-lg p-8 border-2 border-yellow-400 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                {mission.title}
              </h1>
              <p className="text-sm text-gray-400 uppercase">
                {mission.category || "KTP Challenge"}
              </p>
            </div>
            
            {isCompleted ? (
              <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                ✓ COMPLETED
              </span>
            ) : (
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                {mission.xp} XP
              </span>
            )}
          </div>

          <p className="text-gray-300 text-lg mb-6">
            {mission.description}
          </p>
        </div>

        {/* Puzzle Section */}
        <div className="bg-gray-900 rounded-lg p-8 border-2 border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6">Mission Challenge</h2>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <p className="text-xl text-yellow-400 mb-4">{mission.question}</p>
            
            {mission.hint && (
              <p className="text-sm text-gray-500 italic">💡 Hint: {mission.hint}</p>
            )}
          </div>

          {!isCompleted ? (
            <div>
              {mission.puzzleType === "textInput" && (
                <div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full px-4 py-3 rounded bg-gray-800 text-white border-2 border-gray-700 focus:border-yellow-400 focus:outline-none mb-4"
                  />
                </div>
              )}

              {mission.puzzleType === "multipleChoice" && mission.options && (
                <div className="space-y-3 mb-4">
                  {mission.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setUserAnswer(option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition ${
                        userAnswer === option
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold text-xl hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">
                Mission Completed!
              </h3>
              <p className="text-gray-400 mb-6">You earned {mission.xp} XP</p>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-6 bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-400 font-semibold">{successMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}