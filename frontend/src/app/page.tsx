"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { fetchApi, fetchApiAuthenticated } from "@/utils/api";
import { Mission } from "@/types/mission";
import Navbar from "@/components/Navbar";
import MissionCard from "@/components/MissionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AuthGuard from "@/components/AuthGuard";

export default function Home() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchMissions();
    });
    return () => unsub();
  }, []);

  async function fetchMissions() {
    try {
      const res = await fetchApi("/missions");
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error("Error fetching missions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function completeMission(id: string) {
    if (!user) return alert("Please log in first.");

    try {
      const res = await fetchApiAuthenticated(`/missions/${id}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        setMissions((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, completedBy: [...(m.completedBy || []), user.email] }
              : m
          )
        );
      } else {
        console.error(await res.json());
      }
    } catch (err) {
      console.error("Error completing mission:", err);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-black dark:to-zinc-900">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-3">
              Active Missions
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Welcome, Agent {user?.displayName || user?.email}. Complete missions to earn XP.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : missions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission, index) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  index={index}
                  userEmail={user?.email}
                  onComplete={completeMission}
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center">
              No missions available.
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
