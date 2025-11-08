"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5050/missions")
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-8 bg-white dark:bg-black sm:items-start">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={80}
            height={20}
            priority
          />
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Operation Θ: Mission Control
          </h1>
        </div>

        {/* Mission Section */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
            Active Missions
          </h2>

          {loading ? (
            <p className="text-zinc-500 dark:text-zinc-400 animate-pulse">
              Fetching missions...
            </p>
          ) : missions.length > 0 ? (
            <ul className="w-full space-y-4">
              {missions.map((mission) => (
                <li
                  key={mission.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-5 hover:shadow-lg transition-all"
                >
                  <h3 className="text-xl font-semibold text-blue-500">
                    {mission.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-300 mt-2">
                    {mission.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">
              No missions available.
            </p>
          )}
        </div>

        {/* Footer Links */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row mt-10">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy Now
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-zinc-400 px-6 text-zinc-700 dark:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </div>
      </main>
    </div>
  );
}