import { Request, Response } from "express";
import { db } from "../config/firebase";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    // Get all missions to calculate user's total XP
    const snapshot = await db.collection("missions").get();
    const missions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    const completedMissions = missions.filter((m) =>
      m.completedBy?.includes(user.email)
    );

    const totalXP = completedMissions.reduce((sum, m) => sum + (m.xp || 0), 0);

    res.json({
      email: user.email,
      uid: user.uid,
      completedMissions: completedMissions.length,
      totalXP,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("missions").get();
    const missions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Aggregate user stats
    const userStats: Record<
      string,
      { email: string; completedMissions: number; totalXP: number }
    > = {};

    missions.forEach((mission) => {
      const completedBy = mission.completedBy || [];
      completedBy.forEach((email: string) => {
        if (!userStats[email]) {
          userStats[email] = { email, completedMissions: 0, totalXP: 0 };
        }
        userStats[email].completedMissions += 1;
        userStats[email].totalXP += mission.xp || 0;
      });
    });

    // Convert to array and sort by totalXP descending
    const leaderboard = Object.values(userStats).sort(
      (a, b) => b.totalXP - a.totalXP
    );

    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
