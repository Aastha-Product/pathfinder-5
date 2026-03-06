
# Pathfinder Mock Interview Integration Specs

This document outlines the data model and automation workflows required to power the Mock Interview feature.

## 1. Airtable Schema

Create a base with the following tables and fields. Ensure field names match exactly.

### Table: Users
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `id` | Autonumber | Primary Key |
| `name` | Single Line Text | |
| `email` | Email | |
| `role` | Single Select | Options: `Mentor`, `Peer`, `Learner` |
| `skills` | Multiple Select | e.g. `Python`, `SQL` |
| `experience_level` | Single Select | Beginner, Intermediate, Advanced |
| `target_role` | Single Line Text | |
| `timezone` | Single Line Text | |
| `availability_published` | Checkbox | |
| `availability_notes` | Long Text | |
| `is_interview_ready` | Checkbox | Gating logic flag |

### Table: Sessions
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `id` | Autonumber | Primary Key |
| `inviter_id` | Link to Users | |
| `invitee_id` | Link to Users | |
| `proposed_times` | Long Text | |
| `meeting_link` | URL | |
| `status` | Single Select | Options: `pending`, `confirmed`, `completed`, `no_feedback` |
| `created_at` | Created Time | |
| `confirmed_at` | Date | |
| `completed_at` | Date | |
| `notes_private` | Long Text | |

### Table: Feedback
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `id` | Autonumber | Primary Key |
| `session_id` | Link to Sessions | |
| `r_problem` | Number | 1-5 |
| `r_communication` | Number | 1-5 |
| `r_code` | Number | 1-5 |
| `r_depth` | Number | 1-5 |
| `notes` | Long Text | |
| `overall_score` | Formula | `ROUND(AVERAGE({r_problem},{r_communication},{r_code},{r_depth}), 0)` |
| `created_at` | Created Time | |

### Table: PracticeLog
| Field Name | Type | Notes |
| :--- | :--- | :--- |
| `id` | Autonumber | Primary Key |
| `user_id` | Link to Users | |
| `partner_id` | Link to Users | |
| `date` | Date | |
| `notes` | Long Text | |
| `duration_minutes` | Number | |

---

## 2. Automation Workflows (Make / Zapier)

### Flow A: Invite User
**Trigger**: Webhook `POST /webhooks/invite`
**Payload**:
```json
{
  "inviter_id": "rec123...",
  "invitee_id": "rec456...",
  "proposed_times": ["Tomorrow 2pm"],
  "meeting_link": "https://zoom.us/...",
  "message": "Hi..."
}
```
**Steps**:
1. **Airtable: Create Record** in `Sessions` (status = `pending`).
2. **Gmail: Send Email** to Invitee with confirmation link `/confirm-session?sessionId=XYZ`.
3. **Gmail: Send Notification** to Inviter.

### Flow B: Confirm Session
**Trigger**: Invitee clicks link → Endpoint calls Airtable.
**Steps**:
1. **Airtable: Update Record** in `Sessions` set `status` = `confirmed`, `confirmed_at` = NOW().
2. **Gmail: Send Email** to both parties with calendar Invite/Reminders (24h/1h).

### Flow C: Complete Session & Feedback
**Trigger**: Webhook `POST /webhooks/feedback` or `POST /webhooks/complete`
**Steps**:
1. **Airtable: Create Record** in `Feedback`.
2. **Airtable: Update Record** in `Sessions` set `status` = `completed`, `completed_at` = NOW().
3. **Airtable: Create Record** in `PracticeLog` for both users (optional).

---

## 3. Gemini Prompt (AI Practice Plan)

**System Instruction:**
> You are an experienced interview coach. Return a JSON array of 3 practice tasks focused on the learner's weakest rubric area.

**User Prompt:**
```json
{
  "learnerName": "{User Name}",
  "skills": ["{Skill 1}", "{Skill 2}"],
  "lastFeedback": {
    "r_problem": {Score},
    "r_communication": {Score},
    "r_code": {Score},
    "r_depth": {Score}
  }
}
```
