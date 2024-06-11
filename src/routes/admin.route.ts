import express from "express";
import { signUp, login, createTeam, createFixture, updateFixture, deleteFixture } from "../controllers/adminController";
import auth from "../middleware/auth";
import adminAuth from "../middleware/admin";

const router = express.Router();

router.post("/signup", auth, adminAuth, signUp);
router.post("/login", auth, adminAuth, login);
router.post("/teams", auth, adminAuth, createTeam);
router.post("/fixtures", auth, adminAuth, createFixture);
router.put("/fixtures/:id", auth, adminAuth, updateFixture);
router.delete("/fixtures/:id", auth, adminAuth, deleteFixture);

export default router;
