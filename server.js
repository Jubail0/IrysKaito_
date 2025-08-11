import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sessionMiddleware from "./config/sessionConfig.js";
import authRoutes from "./routes/authRoutes.js";
import irysRoutes from "./routes/irysRoutes.js";
import getUserRoutes from "./routes/getUserRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use("/auth", authRoutes);
app.use("/api", irysRoutes);
app.use("/", getUserRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
