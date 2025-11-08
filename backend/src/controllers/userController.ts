import { Request, Response } from "express";
import { db } from "../config/firebase";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

// Register or update user profile
export async function registerUser(req: AuthenticatedRequest, res: Response) {
  const user = req.user;
  const { displayName, photoURL } = req.body;

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create new user
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email.split("@")[0],
        photoURL: photoURL || null,
        totalXP: 0,
        completedMissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Update existing user
      await userRef.update({
        displayName: displayName || userDoc.data()?.displayName,
        photoURL: photoURL || userDoc.data()?.photoURL,
        updatedAt: new Date().toISOString(),
      });
    }

    const updatedDoc = await userRef.get();
    res.json(updatedDoc.data());
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json(userDoc.data());
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}

export async function getLeaderboard(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as any[];

    // Sort by totalXP descending
    const leaderboard = users
      .map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0],
        photoURL: user.photoURL || null,
        totalXP: user.totalXP || 0,
        completedMissions: (user.completedMissions || []).length,
      }))
      .sort((a, b) => b.totalXP - a.totalXP);

    res.json(leaderboard);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
