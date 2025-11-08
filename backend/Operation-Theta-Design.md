# Operation Θ: Escape Room Design Document  
**Theme:** Leadership • Professionalism • Community  

## 1. Story Overview

### Premise
Weeks after *The Louvre Heist*, a copycat infiltration has struck much closer to home — the **Kappa Theta Pi Digital Archives** have been compromised. The records containing years of leadership initiatives, professional resources, and community projects have been locked under a mysterious encryption called **“The Θ Protocol.”**

As a new recruit in KTP, you’ve been selected as **Agent Θ**.  
Your mission: **restore the three Core Pillars of Kappa Theta Pi** — Leadership, Professionalism, and Community — by completing a sequence of digital puzzles and recovering their hidden data keys.  

Succeed, and you’ll reawaken the fraternity’s digital core.  
Fail, and the archive — and its legacy — will vanish forever.  

---

## 2. Puzzle Flow

| Order | Mission ID | Title | Pillar / Theme | Unlock Condition | Description | Puzzle Type |
|:--:|:--|:--|:--|:--|:--|:--|
| 1 | leadership-protocol | **The Leadership Protocol** | Leadership | None | Step into the shoes of a committee lead. Solve a logic grid to assign members to roles that balance skills and teamwork. | Logic Grid / Assignment |
| 2 | professional-network | **The Professional Network** | Professionalism | Complete 1 | Rebuild the lost mentorship web by connecting skills, mentors, and career paths correctly. | Matching / Node Connector |
| 3 | community-signal | **The Community Signal** | Community | Complete 2 | Decode encrypted chat messages to restore the brotherhood communication channels. | Cipher / Word Decoder |
| 4 | the-core | **The Core Restoration** | All (Final) | Complete All | Combine the data keys recovered from all three pillars to unlock the Θ Archive. | Code Entry / Final Unlock |

---

## 3. Puzzle Design Details

### The Leadership Protocol
- **Goal:** Assign members to roles that maximize team efficiency.
- **Mechanic:** Logic puzzle — e.g., “Alex can’t work with Jamie,” “Finance must be filled by someone with at least 2 years experience.”
- **Hint:** “Leadership means finding balance, not control.”
- **Data Fields (Firestore):**
  ```json
  {
    "id": "leadership-protocol",
    "pillar": "Leadership",
    "type": "logic",
    "answer": "balanced_team_42"
  }
  ```

### The Professional Network
- **Goal:** Connect mentors with mentees based on shared skills and goals.
- **Mechanic:** Interactive drag-and-drop between two columns (mentors ↔ mentees).
- **Hint:** “Connections make careers.”
- **Data Fields:**
  ```json
  {
    "id": "professional-network",
    "pillar": "Professionalism",
    "type": "match",
    "answer": {
      "Alice": "DevOps",
      "Ben": "UI Design",
      "Chloe": "Data Science"
    }
  }
  ```

### The Community Signal
- **Goal:** Decode messages between brothers/sisters to reveal a phrase like “Together We Rise.”
- **Mechanic:** Encrypted chat UI (base64 or Caesar cipher).
- **Hint:** “Every message carries meaning when shared.”
- **Data Fields:**
  ```json
  {
    "id": "community-signal",
    "pillar": "Community",
    "type": "cipher",
    "answer": "Together We Rise"
  }
  ```

### The Core Restoration
- **Goal:** Combine the three previous “pillar keys” into the final decryption phrase.
- **Mechanic:** Code input → unlock animation → success screen.
- **Hint:** “Leadership, Professionalism, and Community form the Core.”
- **Data Fields:**
  ```json
  {
    "id": "the-core",
    "pillar": "All",
    "type": "final",
    "dependencies": ["leadership-protocol", "professional-network", "community-signal"],
    "answer": "LPC2025"
  }
  ```

---

## 4. Firestore Schema

**Collection:** `missions`

```jsonc
{
  "id": "mission-id",
  "title": "The Leadership Protocol",
  "description": "Assign team roles to restore KTP’s leadership structure.",
  "pillar": "Leadership",
  "type": "logic",
  "xp": 100,
  "dependencies": [],
  "answer": "balanced_team_42",
  "hints": [
    "Leadership means finding balance, not control."
  ],
  "completedBy": [],
  "media": {
    "image": "/images/missions/leadership.png",
    "audio": "/audio/puzzle1.mp3"
  }
}
```

---

## 5. Technical Implementation Plan

### Frontend (Next.js + Tailwind)
- Create `/missions/[id]` route  
- Render puzzle type conditionally (logic grid, matching, cipher)  
- Handle validation via backend endpoint `/missions/:id/validate`  
- Display progress tracker + unlocked missions  

### Backend (Express + Firestore)
- `GET /missions` → fetch unlocked missions  
- `POST /missions/:id/validate` → verify answer  
- `POST /missions/:id/complete` → mark complete  
- Optional: `/progress/:user` → track per-user status  

**Collections:**  
- `missions` — puzzle data  
- `userProgress` — `{ userId, completedMissions, totalXP }`

---

## 6. Next Steps
- [ ] Finalize mission text + answer keys  
- [ ] Seed Firestore using script  
- [ ] Build first puzzle UI (“Leadership Protocol”)  
- [ ] Add progress visualization on frontend  
- [ ] Test with small KTP group for pacing and clarity  
