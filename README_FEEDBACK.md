# Session Feedback Feature Documentation

## Overview
The Session Feedback feature allows users to provide structured feedback to their mock interview partners. It includes a modal for submitting ratings and notes, a feedback status tracking system, and an aggregated metrics dashboard.

## Key Features
1.  **Feedback Modal**:
    *   **Ratings**: 1-5 star ratings for Problem Solving, Communication, Code Quality, and Technical Depth.
    *   **Adaptive Fields**: Code Quality and Technical Depth are hidden for non-technical sessions (based on skill tags).
    *   **Tags**: Pre-defined tags for quick feedback (e.g., "Good Communication", "Edge Cases Missed").
    *   **Notes**: Private text area for detailed feedback.
    *   **Recording URL**: Optional field to link a session recording (e.g., Loom).
    *   **Privacy Controls**: Public, Anonymous, or Private visibility settings.

2.  **Feedback Status Tracking**:
    *   Sessions have a `feedback_status`: `pending`, `submitted`, or `skipped`.
    *   **Pending**: Shows a "Give Feedback" prompt.
    *   **Submitted**: Shows an "Edit Feedback" button (editable for 72 hours).
    *   **Skipped**: Shows a "Feedback Skipped" status.

3.  **Metrics Aggregation**:
    *   **Formula**: Weighted average of the last N (default 20) submitted feedbacks.
    *   **Decay**: Exponential decay applied to older feedback (`weight = 0.95^ageIndex`).
    *   **Readiness Score**: Normalized 0-100 score based on the aggregated average.

4.  **Quick Prompt**:
    *   A banner appears in "My Schedule" if there are completed sessions with pending feedback.

5.  **CSV Export**:
    *   Users can export their feedback history to a CSV file.

## API Integration (Mock)
The feature is powered by a client-side mock API in `services/api.ts`.

### Endpoints
*   `submitFeedback(payload)`: Submits or updates feedback. Updates session status to `completed` and `feedback_status` to `submitted`.
*   `getFeedbackForSession(sessionId)`: Retrieves existing feedback for a session.
*   `getMetrics(userId)`: Calculates aggregated metrics based on user's feedback history.
*   `exportFeedbacksCSV()`: Generates a CSV string of all feedback given by the user.

## Data Models

### MockSession
```typescript
interface MockSession {
  id: string;
  // ...
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  feedback_status?: 'pending' | 'submitted' | 'skipped';
  skill_tags?: string[]; // Used for adaptive feedback modal
}
```

### Feedback
```typescript
interface Feedback {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  scores: {
    problem_solving: number;
    communication: number;
    code_quality?: number;
    technical_depth?: number;
  };
  notes: string;
  tags: string[];
  privacy: 'public' | 'private' | 'anonymous';
  recordingUrl?: string | null;
  created_at: string;
}
```

## Acceptance Criteria
1.  **Submission**: User can submit feedback with at least one rating > 0.
2.  **Adaptive UI**: Non-technical sessions do not show code-related rating fields.
3.  **Status Update**: Submitting feedback updates the session row to show "Feedback Submitted".
4.  **Aggregation**: The "Readiness Score" on the dashboard updates based on the submitted feedback scores.
5.  **Export**: Clicking "Export CSV" downloads a valid CSV file with feedback data.

## Test Scenarios
1.  **Scenario A: Give Feedback**
    *   Go to "My Schedule".
    *   Click "Give Feedback" on a completed session (or the banner).
    *   Fill out ratings and notes.
    *   Click "Submit".
    *   Verify session row shows "Feedback Submitted".
    *   Verify Readiness Score updates.

2.  **Scenario B: Edit Feedback**
    *   Click "Edit Feedback" on a submitted session.
    *   Change a rating.
    *   Click "Save Changes".
    *   Verify the new rating is persisted.

3.  **Scenario C: Delete Feedback**
    *   Click "Edit Feedback".
    *   Click "Delete".
    *   Confirm deletion.
    *   Verify modal closes (and ideally feedback is removed/reset).

4.  **Scenario D: Non-Technical Session**
    *   Open feedback for a session with only "Behavioral" tag.
    *   Verify "Code Quality" and "Technical Depth" fields are hidden.
