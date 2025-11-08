import { Router } from "express";
import {
  getAllMissions,
  getMissionById,
  completeMission,
} from "../controllers/missionController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.get("/", getAllMissions);
router.get("/:id", getMissionById);
router.post("/:id/complete", verifyAuth, completeMission);

export default router;
