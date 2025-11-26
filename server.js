const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 10000;

// In-memory bots list (resets when server restarts)
let bots = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get all bots (for Game Master)
app.get("/api/bots", (req, res) => {
  res.json(bots);
});

// Add a new bot (from a squad)
app.post("/api/bots", (req, res) => {
  const bot = req.body;

  if (
    !bot ||
    !bot.name ||
    !bot.emoji ||
    typeof bot.maxHealth !== "number" ||
    typeof bot.attackMin !== "number" ||
    typeof bot.attackMax !== "number" ||
    typeof bot.speed !== "number" ||
    typeof bot.crit !== "number"
  ) {
    return res.status(400).json({ error: "Invalid bot payload" });
  }

  bot.id = Date.now() + Math.random(); // simple unique ID
  bot.health = bot.maxHealth;

  bots.push(bot);
  console.log("New bot added:", bot.name);
  res.status(201).json({ ok: true, id: bot.id });
});

// Optional: reset bots (you can hit this manually if needed)
app.post("/api/reset", (req, res) => {
  bots = [];
  console.log("Bots reset");
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
