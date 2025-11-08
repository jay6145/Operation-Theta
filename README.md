# Operation-Theta

Interactive digital escape room designed for KTP pledges at UGA that teaches KTP history, values, and brotherhood through puzzles and challenges.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Express.js, TypeScript, Firebase Admin SDK
- **Database & Auth**: Firebase (Firestore + Authentication)

## Project Structure

### Backend (`/backend`)
```
backend/
├── src/
│   ├── config/          # Firebase & environment configuration
│   ├── middleware/      # Auth middleware (verifyAuth)
│   ├── routes/          # API routes (missions, users)
│   ├── controllers/     # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Database seed scripts
│   ├── utils/           # Helper utilities
│   └── index.ts         # Main server entry point
```

### Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── login/       # Authentication page
│   │   ├── missions/    # Mission pages
│   │   ├── leaderboard/ # Leaderboard view
│   │   └── profile/     # User profile
│   ├── components/      # Reusable React components
│   ├── firebase/        # Firebase client config & auth helpers
│   ├── utils/           # API helpers
│   └── types/           # TypeScript interfaces
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase project with:
  - Firestore database
  - Authentication (Google provider)
  - Service account key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add Firebase service account key:
   - Download `serviceAccountKey.json` from Firebase Console
   - Place it in `/backend` directory (gitignored)

4. Create `.env` file (optional):
   ```env
   PORT=5050
   NODE_ENV=development
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start development server:
   ```bash
   npm run dev
   ```
   Backend runs on http://localhost:5050

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update Firebase config in `src/firebase/config.ts` (if needed)

4. Start development server:
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /missions` - Fetch all missions
- `GET /missions/:id` - Get single mission
- `GET /users/leaderboard` - View leaderboard

### Protected Endpoints (Require Auth)
- `POST /missions/:id/complete` - Mark mission complete
- `GET /users/profile` - Get user profile with stats

## Features

- ✅ Firebase Authentication (Google Sign-In)
- ✅ Mission browsing and completion tracking
- ✅ User profiles with XP and completion stats
- ✅ Leaderboard system
- ✅ Protected routes with AuthGuard
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion

## Development Commands

### Backend
```bash
npm run dev      # Start dev server
npm run build    # Build TypeScript to JS
npm start        # Run production build
npm run seed     # Seed Firestore with missions
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

## Next Steps

1. **Design Escape Room Experience**
   - Define puzzle flow and narrative
   - Map mission dependencies
   - Create puzzle types (code breaking, trivia, pattern recognition)

2. **Build Puzzle UI Components**
   - Interactive puzzle interfaces
   - Progress tracking visualization
   - Timer/countdown system

3. **Expand Backend Logic**
   - Puzzle validation endpoints
   - Sequential unlocking logic
   - Hint system
   - Completion time tracking

4. **Enhance Mission Data**
   - Add puzzle-specific fields (hints, answers, dependencies)
   - Create detailed KTP history content
   - Add multimedia clues

5. **Polish & Testing**
   - Test with actual pledges
   - Add animations and sound effects
   - Mobile responsiveness improvements
   - Completion certificates/badges

## License

Private project for Kappa Theta Pi - UGA Chapter
