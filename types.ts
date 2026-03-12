
import { LucideIcon } from 'lucide-react';

// --- Auth & User Types ---
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export type ExperienceLevel = 'student' | 'junior' | 'mid' | 'senior' | 'manager';
export type InterviewType = 'peer' | 'mentor' | 'both';
export type PrivacyLevel = 'public' | 'private' | 'search_visible';
export type MessagePermission = 'everyone' | 'connections' | 'noone';

export interface AvailabilitySlot {
  weekday: number; // 0-6
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface NotificationSettings {
  email: {
    interview_invites?: boolean;
    session_reminders?: boolean;
  };
  in_app?: {
    interview_invite?: boolean;
    reminder?: boolean;
  };
}

export interface UserProfile {
  id: string;
  // Basic Info
  first_name: string;
  last_name: string;
  display_name?: string;
  photo_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  current_role?: string;
  experience_level?: ExperienceLevel;

  // Professional Info
  skills: string[];
  target_role: string;
  years_experience?: number;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;

  // Interview Readiness
  is_available_for_interview: boolean;
  is_interview_ready?: boolean; // Derived from checklist completion
  timezone?: string;
  availability?: AvailabilitySlot[];
  interview_focus?: string[];
  preferred_interview_type?: 'peer' | 'mentor' | 'both';
  projects?: { title: string; summary: string; url?: string }[];
  feedback_public_opt_in?: 'public' | 'private' | 'off';

  // Privacy & Visibility
  is_public: PrivacyLevel;
  show_skills_publicly: boolean;
  show_progress_publicly: boolean;
  allow_direct_messages: MessagePermission;
  who_can_invite_me: MessagePermission;

  // Account & Security
  email: string;
  email_verified: boolean;
  connected_accounts?: {
    google?: boolean;
    github?: boolean;
    linkedin?: boolean;
  };

  // Notifications
  notification_preferences: NotificationSettings;

  // Metadata
  profile_completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer' | 'Owner';
}

// --- Project Types ---
export type Priority = 'High' | 'Medium' | 'Low';

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  projectId?: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: string[];
  startDate?: string;
  dueDate?: string;
  members: { name: string; avatar: string }[];
  assigneeId?: string;
  subtasks: { completed: number; total: number };
  checklist?: ChecklistItem[];
  status: string;
  comments?: number;
  attachments?: number;
  position?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  visibility: 'Private' | 'Public';
  members: string[];
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// --- Mock Interview Types ---

export interface InterviewPartner {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: 'Peer'; // Strictly Peer for this update
  timezone: string;
  short_bio: string;
  skills: string[];
  rating: number;
  availability_published: boolean;
  next_available?: string;
  company?: string;
  experience_level?: string;
  profile_completion_percentage?: number;
}

export interface MockSession {
  id: string;
  inviter_id: string;
  invitee_id: string;
  partner_name: string;
  partner_avatar: string;
  partner_role: string;
  proposed_times: string;
  meeting_link?: string; // Validated as required in UI
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  confirmed_at?: string;
  completed_at?: string;
  notes_private?: string;
  feedback_status?: 'pending' | 'submitted' | 'skipped';
  skill_tags?: string[]; // Used for adaptive feedback modal
}

export interface FeedbackScores {
  problem_solving: number;
  communication: number;
  code_quality?: number; // Optional if non-technical
  technical_depth?: number; // Optional if non-technical
}

export type FeedbackPrivacy = 'public' | 'private' | 'anonymous';

export interface Feedback {
  id: string;
  session_id: string;
  reviewer_id: string;
  reviewee_id: string;
  scores: FeedbackScores;
  notes: string;
  tags: string[];
  privacy: FeedbackPrivacy;
  recordingUrl?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface PracticeLogEntry {
  id: string;
  user_id: string;
  session_id?: string;
  date: string;
  partner_name?: string;
  duration_minutes: number;
  self_score?: number;
  notes: string;
  type: 'Mock Interview' | 'Self Practice';
}

export interface AIPlanTask {
  title: string;
  expected_minutes: number;
  steps: string[];
  goal: string;
}

export interface InterviewMetrics {
  practicesCount: number;
  avgScore: number;
  improvementTrend: number;
  readinessScore: number;
  confidenceLabel?: string;
}

// --- Community Types ---

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string; // "me" for current user in mocks
  visibility: 'Public' | 'Private';
  maxMembers: number;
  members: string[]; // List of names or IDs
  memberCount: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId?: string;
  author: {
    name: string;
    avatar: string;
  };
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  groupId?: string; // If belongs to a group
  authorId?: string;
  author: {
    name: string;
    avatar: string;
    level?: string;
    matchPercentage?: number;
  };
  content: string;
  tags: string[];
  timestamp: string; // Relative string like "2 hours ago"
  createdAt: string; // ISO String for sorting
  updatedAt?: string;
  likes: number;
  likedByMe: boolean;
  comments: number;
  type?: 'note' | 'session_invite';
  timeInfo?: string;
}

export type ActivityType = 'post' | 'comment' | 'group';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title?: string; // Group Name or implied title
  content: string; // Post text, Comment text, Group description
  createdAt: string;
  metadata: {
    likes?: number;
    comments?: number;
    members?: number;
    role?: string;
    postTitle?: string; // For comments to show context
    postId?: string;    // For comments
    tags?: string[];    // For posts
  };
}

export interface Conversation {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// --- Resource Types ---
export interface Resource {
  id: string;
  title: string;
  type: string; // Video, Course, Article, Book
  author: string;
  rating: number;
  reviews: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string; // URL or placeholder
  why: string; // "Why we recommend this"
  link?: string; // External URL
  tags?: string[];
  provider?: string; // e.g. YouTube, Coursera
  slug?: string;
}

// --- Roadmap Types ---
export type ModuleStatus = 'locked' | 'in-progress' | 'completed';

export interface RoadmapModule {
  id: number;
  categoryId: number;
  title: string;
  estimatedTime: string; // e.g. "20-40 min"
  learnUrl: string;
  testUrl: string;
}

export interface RoadmapCategory {
  id: number;
  title: string;
  modules: RoadmapModule[];
}

export interface UserRoadmapProgress {
  userId: string;
  moduleStatuses: Record<number, ModuleStatus>; // moduleId -> status
  completedModuleIds: number[];
  lastUpdated: string;
}

export interface RoadmapEvent {
  id: string;
  userId: string;
  type: 'resource_click' | 'test_click' | 'module_complete';
  moduleId: number | string;
  timestamp: string;
}

// --- Resource Engine Types (New Schema) ---

export interface ResourceItem {
  type: string; // 'learn', 'read', etc.
  label: string;
  url: string;
}

export interface TestItem {
  type: string; // 'test'
  label: string;
  url: string;
}

export interface CourseModule {
  order: number;
  title: string;
  estimatedMinutes: number;
  subtopics: string[];
  outcome: string;
  isOptional: boolean;
  resources: ResourceItem[];
  tests: TestItem[];
}

export interface CourseProject {
  title: string;
  problem: string;
  tools: string[];
  deliverables: string[];
}

export interface CourseData {
  slug: string;
  title: string;
  shortDesc: string;
  tags: string[];
  isMvpCardOnly?: boolean;
  modules?: CourseModule[];
  projects?: CourseProject[];
  mockInterviewChecklist?: string[];
}

export interface CatalogData {
  courses: CourseData[];
}

export interface UserModuleProgress {
  status: 'locked' | 'in_progress' | 'completed';
}

export interface UserProjectProgress {
  isCompleted: boolean;
}

export interface UserCourseProgressState {
  modules: Record<number, UserModuleProgress>; // Keyed by module order
  projects: Record<string, UserProjectProgress>; // Keyed by project title
}

// --- Legacy / Shared Types ---
export interface NavItem { label: string; href: string; }
export interface Metric { label: string; value: string; icon: LucideIcon; }
export interface Skill { id: string; name: string; initial: string; outcome: string; members: number; }
export interface Step { number: number; title: string; description: string; }
export interface Testimonial { quote: string; author: string; role: string; company: string; }
export interface FAQItem { question: string; answer: string; }
export interface Feature { title: string; description: string; icon: LucideIcon; }
export interface PastSession { id: string; title: string; partner: string; date: string; score: number; feedback: string; }
export interface PracticeTask { id: string; title: string; duration: string; }
export interface DashboardStat { id: string; label: string; value: string; subtext: string; subtextClass: string; icon: LucideIcon; }
export interface ActiveSkill { id: string; name: string; progress: number; totalHours: string; completedHours: string; nextLesson: string; }
export interface UpcomingSession { id: string; mentorName: string; mentorAvatar: string; role: string; date: string; time: string; }
export interface SavedResourceItem { id: string; title: string; type: string; duration: string; rating: number; }
export interface ActiveProject { id: string; title: string; members: number; status: string; }
export interface SuggestedPeer { id: string; name: string; avatar: string; matchPercentage: number; role: string; level: string; availability: string; location: string; peerType: 'Peer' | 'Mentor' | 'Mentee'; }
export interface ChatMessage { id: string; sender: 'me' | 'them'; text: string; timestamp: string; read: boolean; }
export interface InterviewStat { label: string; value: string; subtext: string; icon: LucideIcon; color: string; iconColor: string; }
export interface Mentor { id: string; name: string; role: string; company: string; specialty: string; description: string; avatar: string; rating: number; reviews: number; difficulty: 'Easy' | 'Medium' | 'Hard'; timezone: string; nextAvailable?: string; isMentor: boolean; tags: string[]; }
export interface InterviewSession { id: string; partnerId: string; partnerName: string; date: string; status: 'Completed' | 'Scheduled' | 'Pending'; score?: number; feedbackNotes?: string; type: 'Peer' | 'Mentor'; }
export interface AITask { id: string; title: string; timeEstimate: string; description: string; outcome: string; }
