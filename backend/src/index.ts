// src/index.ts
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/missions", (req, res) => {
  res.json([
    { id: 1, title: "Tech Challenge", description: "Solve a simple puzzle." },
    { id: 2, title: "Brotherhood Task", description: "Work together to progress." }
  ]);
});

const PORT = 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));