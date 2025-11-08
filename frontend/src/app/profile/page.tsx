"use client";
import { useEffect, useState } from "react";
import { fetchApiAuthenticated } from "@/utils/api";
import { UserProfile } from "@/types/mission";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetchApiAuthenticated("/users/profile");
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
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
            👤 Profile
          </h1>

          {loading ? (
            <LoadingSpinner />
          ) : profile ? (
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-300 dark:border-zinc-700 p-8">
              <div className="mb-6">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-xl text-zinc-900 dark:text-zinc-100">
                  {profile.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 uppercase mb-2">
                    Missions Completed
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                    {profile.completedMissions}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 uppercase mb-2">
                    Total XP
                  </p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                    {profile.totalXP}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400 text-center">
              Failed to load profile.
            </p>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
