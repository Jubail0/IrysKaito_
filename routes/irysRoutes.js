import express from "express";
import { fetchCardsData, getMindshare, irysUpload } from "../controllers/irysController.js";
import authMiddleware from "../Middlewares/authMiddleware";
import { checkUploadLimit } from "../Middlewares/uploadLimitMiddleware.js";
const router = express.Router();

router.get("/mindshare", getMindshare);
router.post("/upload",[authMiddleware,checkUploadLimit],irysUpload);
router.get("/getCards", authMiddleware, fetchCardsData);

export default router;