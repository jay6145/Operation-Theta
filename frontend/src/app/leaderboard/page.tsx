"use client";
import { useEffect, useState } from "react";

interface LeaderboardEntry {
  id: string;
  username: string;
  email: string;
  missionsCompleted: number;
  totalXP: number;
  totalTime: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK DATA for now (backend person will add /leaderboard endpoint)
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: "1",
        username: "Alpha Agent",
        email: "alpha@ktp.com",
        missionsCompleted: 12,
        totalXP: 1500,
        totalTime: 240,
      },
      {
        id: "2",
        username: "Beta Operative",
        email: "beta@ktp.com",
        missionsCompleted: 10,
        totalXP: 1200,
        totalTime: 280,
      },
      {
        id: "3",
        username: "Gamma Spy",
        email: "gamma@ktp.com",
        missionsCompleted: 8,
        totalXP: 950,
        totalTime: 320,
      },
      {
        id: "4",
        username: "Delta Hacker",
        email: "delta@ktp.com",
        missionsCompleted: 7,
        totalXP: 850,
        totalTime: 340,
      },
      {
        id: "5",
        username: "Epsilon Coder",
        email: "epsilon@ktp.com",
        missionsCompleted: 6,
        totalXP: 700,
        totalTime: 380,
      },
    ];

    setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    }, 500);

    // WHEN BACKEND READY:
    // fetch("/api/leaderboard")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setLeaderboard(data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching leaderboard:", err);
    //     setLoading(false);
    //   });
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            🏆 LEADERBOARD 🏆
          </h1>
          <p className="text-gray-400 text-lg">
            Top agents ranked by XP and missions completed
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-2xl text-gray-400">
              Loading rankings...
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg border-2 border-yellow-400 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-800 px-6 py-4 grid grid-cols-6 gap-4 font-bold text-yellow-400">
              <div className="col-span-1">Rank</div>
              <div className="col-span-2">Agent</div>
              <div className="col-span-1 text-center">Missions</div>
              <div className="col-span-1 text-center">XP</div>
              <div className="col-span-1 text-center">Time</div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-gray-800">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isTopThree = rank <= 3;

                return (
                  <div
                    key={entry.id}
                    className={`px-6 py-5 grid grid-cols-6 gap-4 items-center hover:bg-gray-800 transition ${
                      isTopThree ? "bg-gray-850" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1">
                      <span
                        className={`text-2xl font-bold ${
                          rank === 1
                            ? "text-yellow-400"
                            : rank === 2
                            ? "text-gray-300"
                            : rank === 3
                            ? "text-orange-600"
                            : "text-gray-500"
                        }`}
                      >
                        {getMedalEmoji(rank)}
                      </span>
                    </div>

                    {/* Agent Info */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                          {entry.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {entry.username}
                          </div>
                          <div className="text-sm text-gray-400">
                            {entry.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Missions */}
                    <div className="col-span-1 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {entry.missionsCompleted}
                      </div>
                      <div className="text-xs text-gray-500">completed</div>
                    </div>

                    {/* XP */}
                    <div className="col-span-1 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {entry.totalXP}
                      </div>
                      <div className="text-xs text-gray-500">XP</div>
                    </div>

                    {/* Time */}
                    <div className="col-span-1 text-center">
                      <div className="text-xl font-bold text-blue-400">
                        {formatTime(entry.totalTime)}
                      </div>
                      <div className="text-xs text-gray-500">total</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-yellow-400">
              {leaderboard.length}
            </div>
            <div className="text-gray-400 mt-1">Total Agents</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-green-400">
              {leaderboard.reduce((sum, e) => sum + e.missionsCompleted, 0)}
            </div>
            <div className="text-gray-400 mt-1">Missions Completed</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-gray-800 text-center">
            <div className="text-4xl mb-2">💎</div>
            <div className="text-3xl font-bold text-yellow-400">
              {leaderboard.reduce((sum, e) => sum + e.totalXP, 0)}
            </div>
            <div className="text-gray-400 mt-1">Total XP Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
}