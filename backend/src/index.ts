// src/index.ts
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Real KTP missions
const missions = [
  {
    id: "1",
    title: "The Three Pillars",
    category: "Knowledge Test",
    description: "Kappa Theta Pi is built on three guiding pillars. Can you name all of them?",
    hint: "Think leadership, growth, and connection.",
    puzzleType: "multipleChoice",
    question: "Select the THREE pillars of KTP:",
    options: [
      "Leadership",
      "Professionalism",
      "Community",
      "Innovation",
      "Technology",
      "Excellence",
    ],
    answer: ["leadership", "professionalism", "community"],
    xp: 100,
    timeLimit: "10 min",
    difficulty: "Easy",
    completed: false,
    completedBy: [],
  },
  {
    id: "2",
    title: "Know Your Commander",
    category: "Leadership",
    description: "Who currently leads the KTP Phi Chapter as President?",
    hint: "Check the Officers page or Discord.",
    puzzleType: "textInput",
    question: "Enter the president's full name:",
    answer: "ryan majd",
    xp: 100,
    timeLimit: "5 min",
    difficulty: "Easy",
    completed: false,
    completedBy: [],
  },
  {
    id: "3",
    title: "The Origin Story",
    category: "History",
    description: "When and where was Kappa Theta Pi founded nationally?",
    hint: "The birthplace of KTP — Go Blue!",
    puzzleType: "textInput",
    question: "When and where was KTP founded? (Format: Month Day, Year, Location)",
    answer: "january 10, 2012, umich",
    xp: 150,
    timeLimit: "15 min",
    difficulty: "Medium",
    completed: false,
    completedBy: [],
  },
  {
    id: "4",
    title: "The Meaning Behind KTP",
    category: "Knowledge",
    description: "What do the letters KTP stand for?",
    hint: "Think about traits of great technologists.",
    puzzleType: "textInput",
    question: "What does KTP stand for? (Format: word, word, word)",
    answer: "knowledge, tenacity, passion",
    xp: 100,
    timeLimit: "10 min",
    difficulty: "Easy",
    completed: false,
    completedBy: [],
  },
  {
    id: "5",
    title: "The Dawgs' Founding",
    category: "UGA History",
    description: "In what year was the UGA branch of KTP founded?",
    hint: "The year of the second coming of KTP — and a national expansion.",
    puzzleType: "textInput",
    question: "What year was KTP UGA founded?",
    answer: "2024",
    xp: 100,
    timeLimit: "5 min",
    difficulty: "Easy",
    completed: false,
    completedBy: [],
  },
  {
    id: "6",
    title: "Executive Match-Up",
    category: "Leadership / Memory",
    description: "Match each KTP executive member to their correct position.",
    hint: "Remember the leadership slides!",
    puzzleType: "matching",
    question: "Match each E-Board member to their position:",
    pairs: [
      { person: "Ryan Majd", position: "President" },
      { person: "Andrew Warner", position: "VP of Membership" },
      { person: "Alli Gay", position: "VP of Marketing" },
      { person: "Daniel Rifai", position: "VP of Finance" },
      { person: "Ajeetha Murugappan", position: "VP of Marketing" },
      { person: "Maadhavan Muthuselvan", position: "VP of Internal Affairs" },
      { person: "Stephen Sulimani", position: "VP of External Affairs" },
      { person: "Manya Vikram", position: "VP of Professional Development" },
      { person: "Ethan Ogle", position: "VP of Technical Development" },
      { person: "Joey Vos", position: "Judicial Chair" },
    ],
    answer: [
      "Ryan Majd:President",
      "Andrew Warner:VP of Membership",
      "Alli Gay:VP of Marketing",
      "Daniel Rifai:VP of Finance",
      "Ajeetha Murugappan:VP of Marketing",
      "Maadhavan Muthuselvan:VP of Internal Affairs",
      "Stephen Sulimani:VP of External Affairs",
      "Manya Vikram:VP of Professional Development",
      "Ethan Ogle:VP of Technical Development",
      "Joey Vos:Judicial Chair",
    ],
    xp: 200,
    timeLimit: "20 min",
    difficulty: "Hard",
    completed: false,
    completedBy: [],
  },
];

app.get("/missions", (req, res) => {
  res.json(missions);
});

app.get("/missions/:id", (req, res) => {
  const mission = missions.find(m => m.id === req.params.id);
  if (mission) {
    res.json(mission);
  } else {
    res.status(404).json({ error: "Mission not found" });
  }
});

app.post("/missions/:id/complete", (req, res) => {
  const mission = missions.find(m => m.id === req.params.id);
  if (mission) {
    mission.completed = true;
    res.json({ message: "Mission completed!", mission });
  } else {
    res.status(404).json({ error: "Mission not found" });
  }
});

const PORT = 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));