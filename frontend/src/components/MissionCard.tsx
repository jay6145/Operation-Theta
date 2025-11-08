"use client";
import { Mission } from "@/types/mission";
import { motion } from "framer-motion";
import Link from "next/link";

interface MissionCardProps {
  mission: Mission;
  index: number;
  userEmail?: string;
  onComplete?: (id: string) => void;
}

export default function MissionCard({
  mission,
  index,
  userEmail,
  onComplete,
}: MissionCardProps) {
  const isCompleted = !!(userEmail && mission.completedBy?.includes(userEmail));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
            {mission.title}
          </h3>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {mission.xp} XP
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase mb-3">
          {mission.category}
        </p>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-3">
          {mission.description}
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/missions/${mission.id}`}
          className="flex-1 text-center rounded-full px-4 py-2 text-sm font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
        >
          View Details
        </Link>
        {onComplete && (
          <button
            disabled={isCompleted}
            onClick={() => onComplete(mission.id)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isCompleted
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isCompleted ? "Completed!" : "Complete"}
          </button>
        )}
      </div>
    </motion.div>
  );
}