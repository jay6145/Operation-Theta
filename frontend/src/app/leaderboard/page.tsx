"use client";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";
import { LeaderboardEntry } from "@/types/mission";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await fetchApi("/users/leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-black dark:to-zinc-900">
        <Navbar />

        <main className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
            🏆 Leaderboard
          </h1>

          {loading ? (
            <LoadingSpinner />
          ) : leaderboard.length > 0 ? (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Agent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Missions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Total XP
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.email}
                      className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                    >
                      <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-bold">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                        {entry.email}
                      </td>
                      <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">
                        {entry.completedMissions}
                      </td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-semibold">
                        {entry.totalXP} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center">
              No leaderboard data yet.
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
