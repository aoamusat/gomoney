import express from "express";
import { signUp, login, getTeams, getFixtures } from "../controllers/userController";
import auth from "../middleware/auth";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/teams", auth, getTeams);
router.get("/fixtures", auth, getFixtures);

export default router;
