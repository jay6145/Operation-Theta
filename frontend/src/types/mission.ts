export interface Mission {
  id: string;
  title: string;
  category: string;
  description: string;
  xp: number;
  completedBy: string[];
  hint?: string;
  puzzleType?: "textInput" | "multipleChoice" | "matching";
  question?: string;
  answer?: string | string[];
  options?: string[];
  pairs?: Array<{ person: string; position: string }>;
}

export interface UserProfile {
  email: string;
  uid: string;
  completedMissions: number;
  totalXP: number;
}

export interface LeaderboardEntry {
  email: string;
  completedMissions: number;
  totalXP: number;
}
