import { Router } from "express";
import { getUserProfile, getLeaderboard } from "../controllers/userController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.get("/profile", verifyAuth, getUserProfile);
router.get("/leaderboard", getLeaderboard);

export default router;
