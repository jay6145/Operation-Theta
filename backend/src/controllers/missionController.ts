import { Request, Response } from "express";
import { db } from "../config/firebase";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export async function getAllMissions(req: Request, res: Response) {
  try {
    const snapshot = await db.collection("missions").get();
    const missions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(missions);
  } catch (err) {
    console.error("Error fetching missions:", err);
    res.status(500).json({ error: "Failed to fetch missions" });
  }
}

export async function getMissionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "Mission ID is required" });
    }
    
    const doc = await db.collection("missions").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Mission not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error fetching mission:", err);
    res.status(500).json({ error: "Failed to fetch mission" });
  }
}

export async function completeMission(req: AuthenticatedRequest, res: Response) {
  const missionId = req.params.id;
  
  if (!missionId) {
    return res.status(400).json({ error: "Mission ID is required" });
  }
  
  const user = req.user; // Added by verifyAuth middleware

  if (!user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const ref = db.collection("missions").doc(missionId);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Mission not found" });
    }

    const data = doc.data();
    const completedBy = new Set(data?.completedBy || []);

    // Use email as identifier
    completedBy.add(user.email);

    await ref.update({ completedBy: Array.from(completedBy) });

    res.json({ success: true, message: "Mission marked complete" });
  } catch (err) {
    console.error("Error completing mission:", err);
    res.status(500).json({ error: "Failed to complete mission" });
  }
}
