// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./src/routers/auth.route.js";
import taskRouter from "./src/routers/task.route.js";
import connectDB from "./src/Database/Database.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

connectDB()

// Use the routers
app.use("/api/auth", authRouter);
app.use("/api/task", taskRouter);

app.get('/', (req, res) => {
  res.send("webrtc video call backend server")
})

export {app}; 
