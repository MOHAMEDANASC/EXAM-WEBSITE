import express from "express";
import Result from "../models/Result.js";
import User from "../models/User.js";

const router = express.Router();

// Get all results sorted by score (Admin only for now)
router.get("/", async (req, res) => {
  try {
    const { adminPassword } = req.headers;
    if (adminPassword !== "examadmin123")
      return res.status(401).json({ message: "Unauthorized" });

    const results = await Result.find()
      .populate("userId", "name phone")
      .sort({ score: -1, createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

export default router;
