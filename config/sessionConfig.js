import session from "express-session";
import dotenv from "dotenv";
dotenv.config();

export default session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    secure: true,
    sameSite: "none"
  }
});
