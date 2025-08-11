import express from "express";
import fetchSession from "../controllers/getUserController.js";
const router = express.Router();


router.get("/auth/me", fetchSession);

export default router;