# Mission Implementation Guide

## Overview

The Operation-Theta escape room features 6 interactive KTP-themed missions with different puzzle types. Each mission tests pledges on KTP history, values, and leadership.

## Mission List

### 1. The Three Pillars (100 XP)
- **Type**: Multiple Choice
- **Description**: Identify the three pillars of KTP
- **Answer**: Leadership, Professionalism, Community
- **Puzzle**: Select from 6 options (3 correct)

### 2. Know Your Commander (100 XP)
- **Type**: Text Input
- **Description**: Name the current KTP UGA President
- **Answer**: ryan majd
- **Puzzle**: Free text input with case-insensitive validation

### 3. The Origin Story (150 XP)
- **Type**: Text Input
- **Description**: When and where was KTP founded nationally?
- **Answer**: january 10, 2012, umich
- **Puzzle**: Formatted text input with hint

### 4. The Meaning Behind KTP (100 XP)
- **Type**: Text Input
- **Description**: What does KTP stand for?
- **Answer**: knowledge, tenacity, passion
- **Puzzle**: Comma-separated text input

### 5. The Dawgs' Founding (100 XP)
- **Type**: Text Input
- **Description**: What year was KTP UGA founded?
- **Answer**: 2024
- **Puzzle**: Simple numeric input

### 6. Executive Match-Up (200 XP)
- **Type**: Matching
- **Description**: Match E-Board members to their positions
- **Answer**: 10 correct person-position pairs
- **Puzzle**: Dropdown matching interface with shuffled positions

## Puzzle Components

### TextInputPuzzle
- Free-form text input with submit button
- Case-insensitive validation
- Optional hint system
- Success/error feedback

### MultipleChoicePuzzle
- Visual checkbox-style selection
- Multi-select or single-select support
- Shows selected count
- Validates against correct answer array

### MatchingPuzzle
- Person-position pairing interface
- Dropdown selects with shuffled options
- Validates all matches must be completed
- Checks exact person:position pairs

## Validation Logic

### Answer Validation (`validateAnswer` function)

1. **String Answers** (Text Input)
   - Converts both user answer and correct answer to lowercase
   - Performs exact string comparison
   - Whitespace is trimmed before comparison

2. **Array Answers** (Multiple Choice)
   - Checks length match
   - Validates every correct answer is in user's selection
   - Case-insensitive comparison

3. **Matching Pairs**
   - Converts to `person:position` format
   - Sorts both arrays for order-independent comparison
   - Validates all pairs match exactly

## Completion Flow

1. User navigates to mission detail page
2. Puzzle component renders based on `puzzleType`
3. User interacts with puzzle (input text, select options, match pairs)
4. User clicks submit button
5. Frontend validates answer client-side
6. If correct:
   - Backend API called to mark mission complete
   - User email added to `completedBy` array
   - XP awarded
   - Success message displayed
7. If incorrect:
   - Error message displayed
   - User can try again
   - Hint becomes available

## Database Structure

Each mission document in Firestore includes:

```typescript
{
  id: string;
  title: string;
  category: string;
  description: string;
  xp: number;
  completedBy: string[];
  hint?: string;
  puzzleType?: "textInput" | "multipleChoice" | "matching";
  question?: string;
  answer?: string | string[];
  options?: string[];       // For multipleChoice
  pairs?: Array<{           // For matching
    person: string;
    position: string;
  }>;
}
```

## Adding New Missions

To add a new mission:

1. **Update seed data** (`backend/src/data/seed.ts`):
   ```typescript
   {
     id: "7",
     title: "Your Mission Title",
     category: "Category",
     description: "Mission description",
     puzzleType: "textInput", // or multipleChoice, matching
     question: "Your question?",
     answer: "correct answer",
     xp: 100,
     completedBy: [],
     hint: "Optional hint",
   }
   ```

2. **Run seed script**:
   ```bash
   cd backend && npm run seed
   ```

3. **Test the mission**:
   - Navigate to `/missions/{id}` in the frontend
   - Verify puzzle renders correctly
   - Test validation with correct/incorrect answers

## Creating New Puzzle Types

To create a new puzzle type:

1. **Create component** in `frontend/src/components/puzzles/`:
   ```typescript
   export default function NewPuzzleType({
     question,
     onSubmit,
     hint,
     isCompleted
   }: NewPuzzleTypeProps) {
     // Implementation
   }
   ```

2. **Update Mission interface** in `frontend/src/types/mission.ts`:
   ```typescript
   puzzleType?: "textInput" | "multipleChoice" | "matching" | "newType";
   ```

3. **Add render case** in `missions/[id]/page.tsx`:
   ```typescript
   case "newType":
     return <NewPuzzleType {...commonProps} onSubmit={handlePuzzleSubmit} />;
   ```

4. **Implement validation** in `validateAnswer` function

## Features

- ✅ 6 KTP-themed missions implemented
- ✅ 3 puzzle types: Text Input, Multiple Choice, Matching
- ✅ Client-side answer validation
- ✅ Hint system for each mission
- ✅ XP rewards (100-200 per mission)
- ✅ Completion tracking per user
- ✅ Real-time feedback (success/error messages)
- ✅ Responsive design with dark mode support

## Testing Checklist

- [ ] Mission 1: Select correct 3 pillars
- [ ] Mission 2: Enter president's name correctly
- [ ] Mission 3: Enter founding date and location
- [ ] Mission 4: Enter KTP meaning
- [ ] Mission 5: Enter founding year
- [ ] Mission 6: Match all 10 E-Board members
- [ ] Verify incorrect answers show error message
- [ ] Verify hints display correctly
- [ ] Verify completed missions show as completed
- [ ] Verify XP is awarded correctly
- [ ] Check leaderboard updates after completions
- [ ] Test on mobile devices
