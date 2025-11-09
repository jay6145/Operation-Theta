"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  timeLimit?: string;
  difficulty?: string;
  puzzleType: "textInput" | "multipleChoice" | "matching";
  question: string;
  answer: string | string[];
  hint?: string;
  options?: string[];
  pairs?: Array<{ person: string; position: string }>;
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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

  function validateAnswer(): boolean {
    if (!mission?.answer) return false;

    const correctAnswer = mission.answer;

    // Handle multiple choice with multiple correct answers
    if (mission.puzzleType === "multipleChoice" && Array.isArray(correctAnswer)) {
      const normalizedSelected = selectedOptions.map(s => s.toLowerCase());
      const normalizedCorrect = correctAnswer.map(a => a.toLowerCase());
      
      return normalizedCorrect.length === normalizedSelected.length &&
             normalizedCorrect.every(ans => normalizedSelected.includes(ans));
    }

    // Handle text input
    if (typeof correctAnswer === "string") {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }

    // Handle text input with multiple acceptable answers
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.some(ans => 
        ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    }

    return false;
  }

  async function handleSubmit() {
    if (!mission || !user) return;

    setError(null);
    setSuccessMessage(null);

    const isCorrect = validateAnswer();

    if (!isCorrect) {
      setError("❌ Incorrect answer. Try again!");
      return;
    }

    // Mark mission as complete in Firestore
    try {
      await setDoc(doc(db, "users", user.uid, "missions", mission.id), {
        completed: true,
        completedAt: new Date(),
        missionId: mission.id,
        xpEarned: mission.xp,
      });

      setMission({
        ...mission,
        completedBy: [...mission.completedBy, user.email!],
      });
      setSuccessMessage(`✅ Correct! Mission completed! You earned ${mission.xp} XP!`);
    } catch (error) {
      console.error("Error completing mission:", error);
      setError("Failed to mark mission as complete.");
    }
  }

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

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
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500"
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
          className="text-yellow-400 hover:text-yellow-300 mb-6 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        {/* Mission Header */}
        <div className="bg-gray-900 rounded-lg p-8 border-2 border-yellow-400 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                {mission.title}
              </h1>
              <p className="text-sm text-gray-400 uppercase mb-2">
                {mission.category}
              </p>
              <div className="flex items-center gap-4 text-sm">
                {mission.timeLimit && (
                  <span className="text-gray-500">⏱️ {mission.timeLimit}</span>
                )}
                {mission.difficulty && (
                  <span className="text-gray-500">🎯 {mission.difficulty}</span>
                )}
              </div>
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

          <p className="text-gray-300 text-lg leading-relaxed">
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
              {/* Text Input Puzzle */}
              {mission.puzzleType === "textInput" && (
                <div>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full px-4 py-3 rounded bg-gray-800 text-white border-2 border-gray-700 focus:border-yellow-400 focus:outline-none mb-4"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }}
                  />
                </div>
              )}

              {/* Multiple Choice Puzzle */}
              {mission.puzzleType === "multipleChoice" && mission.options && (
                <div className="space-y-3 mb-4">
                  {mission.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => toggleOption(option)}
                      className={`w-full text-left px-6 py-4 rounded-lg border-2 transition ${
                        selectedOptions.includes(option)
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedOptions.includes(option) 
                            ? "border-yellow-400 bg-yellow-400" 
                            : "border-gray-600"
                        }`}>
                          {selectedOptions.includes(option) && (
                            <span className="text-black text-sm">✓</span>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Puzzle - Coming Soon */}
              {mission.puzzleType === "matching" && (
                <div className="bg-yellow-400/20 border border-yellow-400 rounded-lg p-6 text-center mb-4">
                  <p className="text-yellow-400 font-bold text-lg mb-2">
                    📝 Matching Puzzle
                  </p>
                  <p className="text-gray-400 text-sm">
                    This advanced puzzle type requires special UI components.
                    Contact your chapter admin to complete this mission!
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={
                  mission.puzzleType === "matching" ||
                  (mission.puzzleType === "textInput" && !userAnswer) ||
                  (mission.puzzleType === "multipleChoice" && selectedOptions.length === 0)
                }
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

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-red-400 font-semibold">{error}</p>
            </div>
          )}

          {/* Success Message */}
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