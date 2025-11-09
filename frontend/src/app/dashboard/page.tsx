"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";  // ← ADDED

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // ← ADDED

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch from real backend
    fetch("/api/missions")
      .then((res) => res.json())
      .then((data) => {
        setMissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching missions:", err);
        setLoading(false);
      });
  }, []);

  const completedMissions = missions.filter(m => m.completed).length;
  const totalMissions = missions.length;
  const progressPercentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Agent'}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Ready to continue your missions?
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Your Progress</h2>
            <span className="text-yellow-400 font-bold text-xl">
              {completedMissions} / {totalMissions} Missions
            </span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full transition-all duration-500 flex items-center justify-center text-black font-bold text-sm"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{completedMissions}</div>
              <div className="text-gray-400 text-sm mt-1">Completed</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{totalMissions - completedMissions}</div>
              <div className="text-gray-400 text-sm mt-1">Remaining</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalMissions * 100}</div>
              <div className="text-gray-400 text-sm mt-1">Total XP</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Available Missions</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-gray-400">Loading missions...</div>
            </div>
          ) : missions.length > 0 ? (
            <div className="grid gap-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 hover:border-yellow-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition">
                          {mission.title}
                        </h3>
                        {mission.completed && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            ✓ COMPLETED
                          </span>
                        )}
                        {!mission.completed && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4">{mission.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-yellow-400 font-bold">
                          💎 {mission.xp || 100} XP
                        </span>
                        <span className="text-gray-500">
                          ⏱️ {mission.timeLimit || '30 min'}
                        </span>
                        <span className="text-gray-500">
                          🎯 Difficulty: {mission.difficulty || 'Medium'}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push(`/missions/${mission.id}`)}  // ← CHANGED THIS
                      className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
                    >
                      {mission.completed ? 'Review' : 'Start Mission'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 text-center border-2 border-gray-800">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No Missions Available</h3>
              <p className="text-gray-500">Check back later for new missions!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}