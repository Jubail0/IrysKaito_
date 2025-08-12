import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();

export default session({
  secret:process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,              // your MongoDB connection string
    collectionName: "sessions",                    // optional, default is 'sessions'
  }),
  cookie: {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    secure:process.env.NODE_ENV === "production", // true in production with HTTPS
  }
});
