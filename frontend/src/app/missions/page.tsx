"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  timeLimit?: string;
  difficulty?: string;
  completed?: boolean;
}

export default function MissionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    fetchMissions();
    if (user) {
      fetchCompletedMissions();
    }
  }, [user]);

  async function fetchMissions() {
    try {
      const res = await fetch("/api/missions");
      const data = await res.json();
      setMissions(data);
    } catch (error) {
      console.error("Error fetching missions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCompletedMissions() {
    if (!user) return;
    
    try {
      const missionsRef = collection(db, "users", user.uid, "missions");
      const snapshot = await getDocs(missionsRef);
      const completed = snapshot.docs
        .filter(doc => doc.data().completed)
        .map(doc => doc.data().missionId);
      setCompletedMissions(completed);
    } catch (error) {
      console.error("Error fetching completed missions:", error);
    }
  }

  const isMissionCompleted = (missionId: string) => {
    return completedMissions.includes(missionId);
  };

  const completedCount = missions.filter(m => isMissionCompleted(m.id)).length;
  const totalXP = missions
    .filter(m => isMissionCompleted(m.id))
    .reduce((sum, m) => sum + m.xp, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading missions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            🎯 All Missions
          </h1>
          <p className="text-gray-400 text-lg">
            Complete missions to earn XP and climb the leaderboard
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-400">
              {completedCount}
            </div>
            <div className="text-gray-400 text-sm mt-1">Completed</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-3xl font-bold text-blue-400">
              {missions.length - completedCount}
            </div>
            <div className="text-gray-400 text-sm mt-1">Remaining</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">💎</div>
            <div className="text-3xl font-bold text-yellow-400">
              {totalXP}
            </div>
            <div className="text-gray-400 text-sm mt-1">Total XP</div>
          </div>
        </div>

        {/* Missions Grid */}
        <div className="grid gap-6">
          {missions.map((mission) => {
            const completed = isMissionCompleted(mission.id);

            return (
              <div
                key={mission.id}
                className={`bg-gray-900 rounded-lg p-6 border-2 transition-all cursor-pointer hover:border-yellow-400 ${
                  completed ? "border-green-500/50" : "border-gray-800"
                }`}
                onClick={() => router.push(`/missions/${mission.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {mission.title}
                      </h3>
                      {completed ? (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          ✓ COMPLETED
                        </span>
                      ) : (
                        <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-400 uppercase mb-2">
                      {mission.category}
                    </p>

                    <p className="text-gray-300 mb-4">
                      {mission.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-400 font-bold">
                        💎 {mission.xp} XP
                      </span>
                      {mission.timeLimit && (
                        <span className="text-gray-500">
                          ⏱️ {mission.timeLimit}
                        </span>
                      )}
                      {mission.difficulty && (
                        <span className="text-gray-500">
                          🎯 {mission.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    className={`px-6 py-3 rounded-lg font-bold transition ${
                      completed
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                  >
                    {completed ? "Review" : "Start Mission"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {missions.length === 0 && (
          <div className="bg-gray-900 rounded-lg p-12 text-center border-2 border-gray-800">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              No Missions Available
            </h3>
            <p className="text-gray-500">Check back later for new missions!</p>
          </div>
        )}
      </div>
    </div>
  );
}