import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// --- MONGODB CONNECTION ---
// Connects to local MongoDB. 'imagination_engine' is the database name.
mongoose
  .connect("mongodb://127.0.0.1:27017/imagination_engine")
  .then(() =>
    console.log("🔮 Connected to MongoDB: The Eternal Vault is open."),
  )
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- DATA SCHEMA ---
// We use a flexible schema so it can store any manifestation data
const FavoriteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  timestamp: String,
  data: Object, // This captures the full Python result (cosmic, meta, etc.)
});

const Favorite = mongoose.model("Favorite", FavoriteSchema);

/**
 * Helper to run Python scripts (Existing Logic preserved)
 */
const runPython = (scriptName: string, res: any, args: string[] = []) => {
  const scriptPath = path.join(__dirname, "..", "python_logic", scriptName);
  const pythonProcess = spawn("python", [scriptPath, ...args]);

  pythonProcess.stdout.on("data", (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      res.json(parsedData);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python Error in ${scriptName}: ${data}`);
  });
};

// --- PERSISTENCE ROUTES (Updated for MongoDB) ---

// 1. Get all saved favorites
app.get("/api/favorites", async (_req, res) => {
  try {
    const favorites = await Favorite.find(); // Pulls everything from the 'favorites' collection
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve the archives." });
  }
});

// 2. Add a new favorite
app.post("/api/favorites", async (req, res) => {
  try {
    const manifestation = req.body;

    // We check if it already exists by ID
    const exists = await Favorite.findOne({ id: manifestation.id });

    if (!exists) {
      const newFav = new Favorite({
        id: manifestation.id,
        type: manifestation.type,
        timestamp: manifestation.timestamp,
        data: manifestation, // Stores the whole object for safety
      });
      await newFav.save();
      res.status(201).json({ status: "Archived in the Vault" });
    } else {
      res.status(200).json({ status: "Already exists" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to save manifestation." });
  }
});

// 3. Delete a favorite
app.delete("/api/favorites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.deleteOne({ id: id }); // Removes the entry by its unique ID
    res.json({ status: "Banished to the Void" });
  } catch (err) {
    res.status(500).json({ error: "Banishment failed." });
  }
});

// --- EXISTING GENERATION ROUTES (Unchanged) ---

app.get("/api/generate", (_req, res) => {
  runPython("generate_world.py", res);
});
app.get("/api/monster", (_req, res) => {
  runPython("monster_summoner.py", res);
});
app.get("/api/npc", (_req, res) => {
  runPython("npc_generator.py", res);
});
app.get("/api/roll", (req, res) => {
  const count = (req.query.count as string) || "1";
  const sides = (req.query.sides as string) || "20";
  runPython("dice_roller.py", res, [count, sides]);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Imagination Engine Backend is live at http://localhost:${PORT}`,
  );
});
