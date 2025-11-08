"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/firebase/auth";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <nav className="w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-black dark:text-white">
          Operation Θ
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Missions
          </Link>
          <Link
            href="/leaderboard"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Leaderboard
          </Link>
          <Link
            href="/profile"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
