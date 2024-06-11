import express from "express";
import { addTeam, getTeams } from "../controllers/teamController";
import auth from "../middleware/auth";
import adminAuth from "../middleware/admin";

const router = express.Router();

router.post("/teams", auth, adminAuth, addTeam);
router.get("/teams", auth, getTeams);

export default router;
