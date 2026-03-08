
import { InterviewPartner, MockSession, AIPlanTask, InterviewMetrics, UserProfile, Feedback, FeedbackScores, Post, Comment, Group, Conversation, ActivityItem, ChatMessage, RoadmapCategory, UserRoadmapProgress, RoadmapEvent, ModuleStatus, CatalogData, CourseData, UserCourseProgressState, CourseModule, ResourceItem, TestItem, UserModuleProgress, UserProjectProgress, Project, Column } from '../types';
import { CHAT_MESSAGES } from '../constants';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Roadmap Data ---
const ROADMAP_CATEGORIES: RoadmapCategory[] = [
  {
    id: 1,
    title: "Interview Foundations",
    modules: [
      { id: 1, categoryId: 1, title: "Resume + LinkedIn", estimatedTime: "20-40 min", learnUrl: "https://www.linkedin.com/learning/topics/resumes", testUrl: "https://www.jobscan.co/blog/linkedin-profile-checklist/" },
      { id: 2, categoryId: 1, title: "Behavioral Interviews (STAR)", estimatedTime: "30-45 min", learnUrl: "https://in.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique", testUrl: "https://nationalcareers.service.gov.uk/careers-advice/interview-advice/the-star-method" },
      { id: 3, categoryId: 1, title: "Communication & Storytelling", estimatedTime: "30-40 min", learnUrl: "https://hbr.org/topic/communication", testUrl: "https://www.mindtools.com/" },
      { id: 4, categoryId: 1, title: "Mock Interview Practice (Peer)", estimatedTime: "45-60 min", learnUrl: "https://www.pramp.com/", testUrl: "https://www.interviewbit.com/" }
    ]
  },
  {
    id: 2,
    title: "Core Tech",
    modules: [
      { id: 5, categoryId: 2, title: "SQL Fundamentals", estimatedTime: "40-60 min", learnUrl: "https://sqlbolt.com/", testUrl: "https://www.hackerrank.com/skills-verification/sql_basic" },
      { id: 6, categoryId: 2, title: "Advanced SQL (Joins, Window Functions)", estimatedTime: "45-60 min", learnUrl: "https://mode.com/sql-tutorial/", testUrl: "https://leetcode.com/problemset/database/" },
      { id: 7, categoryId: 2, title: "Data Structures", estimatedTime: "60-90 min", learnUrl: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", testUrl: "https://neetcode.io/practice" },
      { id: 8, categoryId: 2, title: "Algorithms", estimatedTime: "60-90 min", learnUrl: "https://www.techinterviewhandbook.org/algorithms/study-plan/", testUrl: "https://leetcode.com/problemset/" },
      { id: 9, categoryId: 2, title: "JavaScript Basics", estimatedTime: "30-45 min", learnUrl: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting", testUrl: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
      { id: 10, categoryId: 2, title: "React Fundamentals", estimatedTime: "45-60 min", learnUrl: "https://react.dev/learn/tutorial-tic-tac-toe", testUrl: "https://www.frontendmentor.io/challenges" },
      { id: 11, categoryId: 2, title: "Backend Fundamentals (Node)", estimatedTime: "40-60 min", learnUrl: "https://www.w3schools.com/nodejs/nodejs_intro.asp", testUrl: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" },
      { id: 12, categoryId: 2, title: "APIs (REST)", estimatedTime: "30-45 min", learnUrl: "https://www.postman.com/learn/", testUrl: "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript" },
      { id: 13, categoryId: 2, title: "Auth Basics (Sessions/JWT)", estimatedTime: "30-45 min", learnUrl: "https://jwt.io/introduction", testUrl: "https://portswigger.net/web-security/authentication" },
      { id: 14, categoryId: 2, title: "Git + GitHub", estimatedTime: "20-30 min", learnUrl: "https://docs.github.com/en/get-started/quickstart", testUrl: "https://www.w3schools.com/git/" },
      { id: 15, categoryId: 2, title: "System Design Basics", estimatedTime: "60-90 min", learnUrl: "https://github.com/donnemartin/system-design-primer", testUrl: "https://www.educative.io/blog/system-design-interview-questions" }
    ]
  },
  {
    id: 3,
    title: "Product + Business",
    modules: [
      { id: 16, categoryId: 3, title: "Product Management Foundations", estimatedTime: "30-45 min", learnUrl: "https://www.productschool.com/resources", testUrl: "https://www.productmanagementexercises.com/" },
      { id: 17, categoryId: 3, title: "Product Sense (Prioritization)", estimatedTime: "30-45 min", learnUrl: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/", testUrl: "https://www.productmanagementexercises.com/" },
      { id: 18, categoryId: 3, title: "Metrics & Analytics", estimatedTime: "40-50 min", learnUrl: "https://www.mode.com/analytics-dispatch/", testUrl: "https://www.kaggle.com/learn" },
      { id: 19, categoryId: 3, title: "Case Interviews (PM/Biz)", estimatedTime: "45-60 min", learnUrl: "https://www.caseinterview.com/", testUrl: "https://www.preplounge.com/en/" },
      { id: 20, categoryId: 3, title: "Project Management Basics", estimatedTime: "30-45 min", learnUrl: "https://www.atlassian.com/agile", testUrl: "https://www.scrum.org/open-assessments" },
      { id: 21, categoryId: 3, title: "Agile/Scrum", estimatedTime: "20-30 min", learnUrl: "https://www.scrumguides.org/", testUrl: "https://www.scrum.org/open-assessments" },
      { id: 22, categoryId: 3, title: "HR Interview Basics", estimatedTime: "20-30 min", learnUrl: "https://resources.workable.com/tutorial/interview-questions", testUrl: "https://www.indeed.com/career-advice/interviewing" }
    ]
  },
  {
    id: 4,
    title: "Portfolio Proof",
    modules: [
      { id: 23, categoryId: 4, title: "Portfolio Project: SQL Analytics Case", estimatedTime: "2-3 hours", learnUrl: "https://sqlbolt.com/", testUrl: "https://leetcode.com/problemset/database/" },
      { id: 24, categoryId: 4, title: "Portfolio Project: API + Auth Mini App", estimatedTime: "3-4 hours", learnUrl: "https://www.postman.com/learn/", testUrl: "https://portswigger.net/web-security/authentication" },
      { id: 25, categoryId: 4, title: "Portfolio Project: PM Case Study", estimatedTime: "2-3 hours", learnUrl: "https://www.productschool.com/resources", testUrl: "https://www.productmanagementexercises.com/" }
    ]
  }
];

export const getInitialProgress = (): UserRoadmapProgress => {
  // Default: First module of each category (except 4) is in-progress
  const initialStatuses: Record<number, ModuleStatus> = {};

  // Set all to locked initially
  ROADMAP_CATEGORIES.forEach(cat => {
    cat.modules.forEach(mod => {
      initialStatuses[mod.id] = 'locked';
    });
  });

  // Unlock first module of Cat 1, 2, 3
  [1, 5, 16].forEach(id => {
    initialStatuses[id] = 'in-progress';
  });

  return {
    userId: '',
    moduleStatuses: initialStatuses,
    completedModuleIds: [],
    lastUpdated: new Date().toISOString()
  };
};

let USER_ROADMAP_PROGRESS: UserRoadmapProgress = getInitialProgress();
let ROADMAP_EVENTS: RoadmapEvent[] = [];

// --- In-Memory Mock Data Storage ---

let SESSIONS: MockSession[] = [
  {
    id: 's1',
    inviter_id: 'p1',
    invitee_id: 'me',
    partner_name: 'David Kim',
    partner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    partner_role: 'Peer',
    proposed_times: 'Tomorrow 10:00 AM PST',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'pending',
    created_at: new Date().toISOString(),
    skill_tags: ['React', 'System Design'],
    feedback_status: 'pending'
  },
  {
    id: 's2',
    inviter_id: 'me',
    invitee_id: 'p1',
    partner_name: 'David Kim',
    partner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    partner_role: 'Peer',
    proposed_times: 'Tomorrow 10:00 AM PST',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    confirmed_at: new Date().toISOString(),
    skill_tags: ['React', 'System Design'],
    feedback_status: 'pending'
  },
  {
    id: 's3',
    inviter_id: 'me',
    invitee_id: 'p2',
    partner_name: 'Sarah Chen',
    partner_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    partner_role: 'Mentor',
    proposed_times: 'Feb 1, 2:00 PM',
    meeting_link: 'https://meet.google.com/xyz-uvw-rst',
    status: 'completed',
    created_at: new Date('2024-02-01T14:00:00Z').toISOString(),
    confirmed_at: new Date('2024-02-01T10:00:00Z').toISOString(),
    completed_at: new Date('2024-02-01T15:00:00Z').toISOString(),
    skill_tags: ['Behavioral', 'Product Management'],
    feedback_status: 'submitted',
    notes_private: 'Great session! Sarah gave excellent feedback on my STAR method.'
  },
  {
    id: 's4',
    inviter_id: 'p3',
    invitee_id: 'me',
    partner_name: 'Michael Chen',
    partner_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    partner_role: 'Peer',
    proposed_times: 'Feb 5, 4:00 PM',
    meeting_link: 'https://meet.google.com/new-link-here',
    status: 'completed',
    created_at: new Date('2024-02-05T14:00:00Z').toISOString(),
    confirmed_at: new Date('2024-02-05T10:00:00Z').toISOString(),
    completed_at: new Date('2024-02-05T17:00:00Z').toISOString(),
    skill_tags: ['Python', 'Algorithms'],
    feedback_status: 'pending'
  }
];

let FEEDBACKS: Feedback[] = [];

// --- Profile Data ---

const INITIAL_PROFILE: UserProfile = {
  id: 'uuid-123',
  first_name: 'Aastha',
  last_name: 'Pandey',
  display_name: 'Aastha Pandey',
  photo_url: 'https://ui-avatars.com/api/?name=Aastha+Pandey&background=0D8ABC&color=fff',
  headline: 'Aspiring Frontend Engineer',
  bio: '3+ years in product management, learning data structures and algorithms to transition into software engineering.',
  location: 'Bengaluru, India',
  current_role: 'Product Manager',
  experience_level: 'mid',
  skills: ['React', 'TypeScript', 'Product Management'],
  target_role: 'Frontend Engineer',
  years_experience: 3,
  resume_url: '',
  linkedin_url: 'https://linkedin.com/in/aastha',
  github_url: 'https://github.com/aastha',
  portfolio_url: '',
  is_public: 'private',
  show_skills_publicly: true,
  show_progress_publicly: false,
  allow_direct_messages: 'connections',
  who_can_invite_me: 'everyone',
  is_available_for_interview: true,
  timezone: 'Asia/Kolkata',
  availability: [
    { weekday: 1, start_time: "18:00", "end_time": "20:00" },
    { weekday: 3, start_time: "18:00", "end_time": "20:00" }
  ],
  interview_focus: ["Frontend", "Behavioral"],
  feedback_public_opt_in: 'private',
  notification_preferences: {
    email: { interview_invites: true, session_reminders: true },
    in_app: { interview_invite: true, reminder: true }
  },
  is_interview_ready: false,
  profile_completion_percentage: 72,
  email: 'aastha@example.com',
  email_verified: true,
  connected_accounts: { google: true, linkedin: true },
  created_at: "2026-02-26T00:00:00Z",
  updated_at: "2026-02-26T00:00:00Z"
};

let CURRENT_USER_PROFILE: UserProfile = { ...INITIAL_PROFILE };

const calculateProfileCompletion = (profile: UserProfile): number => {
  let score = 0;

  // Basic Info: 50 points
  if (profile.first_name && profile.last_name) score += 10;
  if (profile.photo_url) score += 15;
  if (profile.headline) score += 5;
  if (profile.bio) score += 5;
  if (profile.current_role) score += 5;
  if (profile.location) score += 2;
  if (profile.experience_level) score += 8;

  // Professional Info: 30 points
  if (profile.skills && profile.skills.length > 0) score += 20;
  if (profile.target_role) score += 5;
  if (profile.resume_url || profile.linkedin_url || profile.github_url || profile.portfolio_url) score += 5;

  // Interview Readiness: 15 points
  if (profile.is_available_for_interview) score += 2;
  if (profile.timezone) score += 3;
  if (profile.availability && profile.availability.length > 0) score += 5;
  if (profile.interview_focus && profile.interview_focus.length > 0) score += 5;

  // Security: 5 points
  if (profile.email_verified) score += 5;

  return Math.min(100, Math.round(score));
};

// Update initial score
CURRENT_USER_PROFILE.profile_completion_percentage = calculateProfileCompletion(CURRENT_USER_PROFILE);

// --- Groups Data Store ---
let GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'SQL Study Group',
    description: 'Weekly practice for SQL Leetcode problems.',
    ownerId: 'me',
    visibility: 'Public',
    maxMembers: 5,
    members: ['You', 'Sarah Chen', 'David Kim'],
    memberCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// --- Community Data Store ---

let POSTS: Post[] = [
  {
    id: 'p1',
    author: { name: 'Sarah Chen', avatar: 'SC', level: 'Intermediate', matchPercentage: 92 },
    content: "Looking for a study partner to practice SQL joins and aggregations. I'm preparing for data analyst interviews and would love to do mock sessions together. Available weekday evenings PST.",
    tags: ['SQL', 'Study Partner', 'Mock Interview'],
    timestamp: '2 hours ago',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 12,
    likedByMe: false,
    comments: 2,
    type: 'note'
  },
  {
    id: 'p2',
    author: { name: 'David Kim', avatar: 'DK', level: 'Beginner', matchPercentage: 88 },
    content: "Just completed my first Python project! Created a simple calculator app. Looking for feedback and tips on how to improve my code structure.",
    tags: ['Python', 'Beginner', 'Project'],
    timestamp: '5 hours ago',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    likes: 24,
    likedByMe: true,
    comments: 1,
    type: 'note'
  },
  // Added a post by "You" for My Activity demo
  {
    id: 'p3',
    author: { name: 'You', avatar: 'ME', level: 'Beginner', matchPercentage: 100 },
    content: "Is anyone else struggling with React useEffect hooks? I feel like I'm creating infinite loops way too often. Any good resources?",
    tags: ['React', 'Hooks', 'Help'],
    timestamp: '1 day ago',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 5,
    likedByMe: false,
    comments: 3,
    type: 'note'
  }
];

let COMMENTS: Record<string, Comment[]> = {
  'p1': [
    { id: 'c1', postId: 'p1', author: { name: 'Mike T', avatar: 'MT' }, text: 'I am interested! Sent you a DM.', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'c2', postId: 'p1', author: { name: 'Emily W', avatar: 'EW' }, text: 'Is this still open?', createdAt: new Date(Date.now() - 1800000).toISOString() }
  ],
  'p2': [
    { id: 'c3', postId: 'p2', author: { name: 'Sarah Chen', avatar: 'SC' }, text: 'Great start! Check out PEP8 guidelines.', createdAt: new Date(Date.now() - 7200000).toISOString() }
  ],
  // Comment by "You"
  'p1_c_me': [
    { id: 'c4', postId: 'p1', author: { name: 'You', avatar: 'ME' }, text: 'I can join too if you need a third!', createdAt: new Date(Date.now() - 3000000).toISOString() }
  ]
};

// Add comment to store
if (!COMMENTS['p1']) COMMENTS['p1'] = [];
COMMENTS['p1'].push({ id: 'c4', postId: 'p1', author: { name: 'You', avatar: 'ME' }, text: 'I can join too if you need a third!', createdAt: new Date(Date.now() - 3000000).toISOString() });


const PEERS: InterviewPartner[] = [
  {
    id: 'p1',
    name: 'David Kim',
    email: 'david@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'Peer',
    timezone: 'EST',
    short_bio: 'Preparing for frontend interviews. Happy to trade mock sessions.',
    skills: ['React', 'JavaScript', 'CSS'],
    rating: 4.8,
    availability_published: true,
    next_available: 'Weekends',
    experience_level: 'Intermediate'
  },
  {
    id: 'p2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'Peer',
    timezone: 'PST',
    short_bio: 'Ex-Google. Focusing on System Design and Backend architecture.',
    skills: ['System Design', 'Python', 'Go'],
    rating: 4.9,
    availability_published: true,
    next_available: 'Today, 4:00 PM',
    experience_level: 'Senior'
  },
  {
    id: 'p3',
    name: 'Emily Wilson',
    email: 'emily@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    role: 'Peer',
    timezone: 'PST',
    short_bio: 'Junior Dev looking to practice behavioral and easy LeetCode.',
    skills: ['Algorithms', 'Java'],
    rating: 4.5,
    availability_published: false,
    next_available: 'Evenings',
    experience_level: 'Beginner'
  },
  {
    id: 'p4',
    name: 'Michael Torres',
    email: 'mike@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    role: 'Peer',
    timezone: 'GMT',
    short_bio: 'Fullstack dev. Can help with React and Node.js mock interviews.',
    skills: ['React', 'Node.js', 'SQL'],
    rating: 4.7,
    availability_published: true,
    next_available: 'Tomorrow',
    experience_level: 'Intermediate'
  }
];

// --- Resource Engine Catalog ---
// --- Resource Engine Catalog ---
const CATALOG: CatalogData = {
  "courses": [
    {
      "slug": "sql-developer",
      "title": "SQL Developer",
      "shortDesc": "Master SQL from scratch: queries, joins, database design, and performance tuning for data roles.",
      "tags": ["SQL", "Database", "Analytics"],
      "modules": [
        {
          "order": 1,
          "title": "SQL Fundamentals",
          "estimatedMinutes": 120,
          "subtopics": ["SELECT, FROM, WHERE", "Filtering & Sorting", "Aggregations (COUNT, SUM, AVG)", "GROUP BY & HAVING"],
          "outcome": "Write basic queries to extract and summarize data.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "SQLBolt - Interactive Lessons", "url": "https://sqlbolt.com/" }
          ],
          "tests": [
            { "type": "test", "label": "SQL Basic Quiz", "url": "https://www.w3schools.com/sql/sql_quiz.asp" }
          ]
        },
        {
          "order": 2,
          "title": "Joins & Relationships",
          "estimatedMinutes": 180,
          "subtopics": ["INNER JOIN", "LEFT/RIGHT JOIN", "Primary & Foreign Keys", "Self Joins"],
          "outcome": "Combine data from multiple tables accurately.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Visual Join Guide", "url": "https://joins.spathon.com/" }
          ],
          "tests": []
        },
        {
          "order": 3,
          "title": "Advanced SQL & Performance",
          "estimatedMinutes": 240,
          "subtopics": ["Window Functions", "CTEs (WITH)", "Indexing basics", "Query execution plans"],
          "outcome": "Write efficient, complex queries for real-world analysis.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Mode Analytics SQL Tutorial", "url": "https://mode.com/sql-tutorial/" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "E-commerce Analytics Dashboard",
          "problem": "Analyze sales data to find top products, customer retention, and revenue trends.",
          "tools": ["SQL", "PostgreSQL"],
          "deliverables": ["SQL scripts", "Analysis report", "Schema diagram"]
        }
      ],
      "mockInterviewChecklist": [
        "Explain the difference between INNER and LEFT JOIN.",
        "How do you optimize a slow query?",
        "Write a query to find the top 3 salaries in each department.",
        "Explain ACID properties."
      ]
    },
    {
      "slug": "data-science",
      "title": "Data Science",
      "shortDesc": "Math + Python + SQL + ML + optional deep learning + deployment basics.",
      "tags": ["Python", "SQL", "ML", "Portfolio"],
      "modules": [
        {
          "order": 1,
          "title": "Math Foundations (Linear Algebra)",
          "estimatedMinutes": 120,
          "subtopics": ["Vectors", "Matrices", "Linear transformations", "Eigenvalues"],
          "outcome": "Understand core math behind ML models.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "3Blue1Brown linear algebra", "url": "https://www.3blue1brown.com/topics/linear-algebra" },
            { "type": "learn", "label": "Linear Algebra for Data Science (Video)", "url": "https://www.youtube.com/watch?v=SioiFuMRiv4" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "SQL for Data Science",
          "estimatedMinutes": 120,
          "subtopics": ["Joins", "Aggregations", "CTEs", "Window functions"],
          "outcome": "Query and analyze data in relational systems.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "SQLBolt interactive SQL", "url": "https://sqlbolt.com/" },
            { "type": "learn", "label": "SQL for Data Science (Video)", "url": "https://www.youtube.com/watch?v=Jc_VG0DM6rI" }
          ],
          "tests": [
            { "type": "test", "label": "SQL quiz", "url": "https://www.w3schools.com/sql/sql_quiz.asp" }
          ]
        },
        {
          "order": 3,
          "title": "Python Foundations",
          "estimatedMinutes": 120,
          "subtopics": ["Control flow", "Data structures", "Functions", "Basic OOP"],
          "outcome": "Build reusable Python code for data workflows.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python official tutorial", "url": "https://docs.python.org/3/tutorial/" },
            { "type": "learn", "label": "Python for Data Science (Video)", "url": "https://www.youtube.com/watch?v=CMEWVn1uZpQ" }
          ],
          "tests": [
            { "type": "test", "label": "Python quiz", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 4,
          "title": "Data Cleaning + pandas",
          "estimatedMinutes": 180,
          "subtopics": ["Missing data", "Duplicates", "Transformations"],
          "outcome": "Prepare datasets for modeling.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "pandas missing data guide", "url": "https://pandas.pydata.org/docs/user_guide/missing_data.html" }
          ],
          "tests": [
            { "type": "test", "label": "pandas quiz", "url": "https://www.w3schools.com/python/pandas/pandas_quiz.asp" }
          ]
        },
        {
          "order": 5,
          "title": "Core Machine Learning",
          "estimatedMinutes": 240,
          "subtopics": ["Regression", "Classification", "Overfitting", "Metrics"],
          "outcome": "Train baseline ML models and evaluate them properly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course" }
          ],
          "tests": [
            { "type": "test", "label": "MLCC exercises", "url": "https://developers.google.com/machine-learning/crash-course/exercises" }
          ]
        },
        {
          "order": 6,
          "title": "Model Evaluation + Cross Validation",
          "estimatedMinutes": 120,
          "subtopics": ["Cross-validation", "Grid search", "Scoring"],
          "outcome": "Avoid common interview mistakes in evaluation and leakage.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "scikit-learn cross-validation guide", "url": "https://scikit-learn.org/stable/modules/cross_validation.html" }
          ],
          "tests": [
            { "type": "test", "label": "scikit-learn MOOC quiz", "url": "https://inria.github.io/scikit-learn-mooc/predictive_modeling_pipeline/02_numerical_pipeline_quiz_m1_02.html" }
          ]
        },
        {
          "order": 7,
          "title": "Big Data Basics (Spark)",
          "estimatedMinutes": 120,
          "subtopics": ["Spark shell", "DataFrames", "Transformations"],
          "outcome": "Understand distributed data processing basics.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Spark quick start", "url": "https://spark.apache.org/docs/latest/quick-start.html" },
            { "type": "learn", "label": "Apache Spark Tutorial (Video)", "url": "https://www.youtube.com/watch?v=bfqiGAn6Ws0&t=1s" },
            { "type": "learn", "label": "PySpark Crash Course (Video)", "url": "https://www.youtube.com/watch?v=761SQ9Hxbic" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Deployment Basics (FastAPI + Docker)",
          "estimatedMinutes": 180,
          "subtopics": ["API endpoint", "Containerize model service"],
          "outcome": "Ship a minimal model API and run it reproducibly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "FastAPI first steps", "url": "https://fastapi.tiangolo.com/tutorial/first-steps/" },
            { "type": "learn", "label": "Docker get started", "url": "https://docs.docker.com/get-started/" },
            { "type": "learn", "label": "FastAPI Tutorial (Video)", "url": "https://www.youtube.com/watch?v=Rj-OtK2n5jU" },
            { "type": "learn", "label": "Docker for Data Science (Video)", "url": "https://www.youtube.com/watch?v=EWvNQjAaOHw" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "NLP / LLM Basics (Optional)",
          "estimatedMinutes": 180,
          "subtopics": ["Transformers basics", "Tokens", "Fine-tuning concepts"],
          "outcome": "Understand how LLM/NLP pipelines work.",
          "isOptional": true,
          "resources": [
            { "type": "learn", "label": "Hugging Face LLM course", "url": "https://huggingface.co/learn/llm-course/en/chapter1/1" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "House Price Prediction",
          "problem": "Predict prices and explain drivers with a regression baseline.",
          "tools": ["Python", "pandas", "scikit-learn"],
          "deliverables": ["EDA notebook", "Model + metrics", "Insights report"]
        },
        {
          "title": "Loan Uptake Probability Modeling",
          "problem": "Predict which users will take personal loans and propose targeting rules.",
          "tools": ["Python", "scikit-learn"],
          "deliverables": ["Model pipeline", "Threshold decision", "Business memo"]
        },
        {
          "title": "End-to-End ML API",
          "problem": "Deploy one of your models as an API and containerize it.",
          "tools": ["FastAPI", "Docker"],
          "deliverables": ["Running API", "Dockerfile", "README + sample calls"]
        }
      ],
      "mockInterviewChecklist": [
        "Technical: Explain bias vs variance.",
        "Coding: Implement a basic ML algorithm (e.g. k-means) or data manipulation.",
        "Scenario: How do you handle missing data?",
        "Behavioral: Describe a challenging modeling problem you solved."
      ]
    },
    {
      "slug": "data-analytics",
      "title": "Data Analytics",
      "shortDesc": "Excel + SQL + Python + Dashboards + basic statistics for job-ready analytics.",
      "tags": ["Excel", "SQL", "Python", "Tableau"],
      "modules": [
        {
          "order": 1,
          "title": "Problem Framing + Analytics Process",
          "estimatedMinutes": 40,
          "subtopics": ["CRISP-DM workflow", "Define metrics", "Stakeholder questions"],
          "outcome": "Turn vague requests into measurable analytics tasks.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "CRISP-DM overview", "url": "https://www.datascience-pm.com/crisp-dm-2/" },
            { "type": "learn", "label": "Data Analytics for Beginners (Video)", "url": "https://www.youtube.com/watch?v=GRzb3x7I6B8" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Excel / Spreadsheets for Analysis",
          "estimatedMinutes": 60,
          "subtopics": ["Cleaning basics", "PivotTables", "Charts for reporting"],
          "outcome": "Summarize and report insights fast using spreadsheets.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "PivotTable guide", "url": "https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576" },
            { "type": "learn", "label": "Master Excel for Data Analytics", "url": "https://www.youtube.com/watch?v=SA_SDo-cqpg&t=7268s" }
          ],
          "tests": [
            { "type": "test", "label": "Excel skills test", "url": "https://corporatefinanceinstitute.com/resources/excel/excel-test/" }
          ]
        },
        {
          "order": 3,
          "title": "SQL for Analytics",
          "estimatedMinutes": 90,
          "subtopics": ["Joins", "Aggregations", "CTEs", "Window functions"],
          "outcome": "Answer business questions from relational datasets using advanced SQL.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "SQLBolt interactive SQL", "url": "https://sqlbolt.com/" },
            { "type": "learn", "label": "SQL for Data Analytics (Video)", "url": "https://www.youtube.com/watch?v=l8DCPaHc5TQ" }
          ],
          "tests": [
            { "type": "test", "label": "SQL quiz", "url": "https://www.w3schools.com/sql/sql_quiz.asp" }
          ]
        },
        {
          "order": 4,
          "title": "Python Foundations",
          "estimatedMinutes": 90,
          "subtopics": ["Control flow", "Functions", "Data structures", "Basic OOP"],
          "outcome": "Write basic scripts and manipulate datasets in Python.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python official tutorial", "url": "https://docs.python.org/3/tutorial/" },
            { "type": "learn", "label": "Python for Data Science (Video)", "url": "https://www.youtube.com/watch?v=r-uOLxNrNk8" }
          ],
          "tests": [
            { "type": "test", "label": "Python quiz", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 5,
          "title": "Python Libraries for Analytics",
          "estimatedMinutes": 120,
          "subtopics": ["pandas basics", "Cleaning", "EDA", "Simple plots"],
          "outcome": "Clean, transform, and explore data with pandas.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "pandas user guide", "url": "https://pandas.pydata.org/docs/user_guide/index.html" }
          ],
          "tests": [
            { "type": "test", "label": "pandas quiz", "url": "https://www.w3schools.com/python/pandas/pandas_quiz.asp" }
          ]
        },
        {
          "order": 6,
          "title": "Statistics + Hypothesis Testing",
          "estimatedMinutes": 120,
          "subtopics": ["Distributions", "Confidence intervals", "t-test / chi-square / ANOVA"],
          "outcome": "Pick the right statistical test and interpret results correctly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Intro to Modern Statistics (free textbook)", "url": "https://openintro-ims.netlify.app/" },
            { "type": "read", "label": "Hypothesis testing overview", "url": "https://www.tutorialspoint.com/statistics/hypothesis_testing.htm" },
            { "type": "learn", "label": "Statistics for Data Science (Video)", "url": "https://www.youtube.com/watch?v=K9teElePNkk" }
          ],
          "tests": [
            { "type": "test", "label": "Hypothesis testing MCQ quiz", "url": "https://www.gkseries.com/mcq-on-hypothesis-testing/multiple-choice-questions-and-answers-on-hypothesis-testing.php" }
          ]
        },
        {
          "order": 7,
          "title": "Dashboards + Storytelling",
          "estimatedMinutes": 120,
          "subtopics": ["Power BI basics", "Dashboards", "Presenting insights"],
          "outcome": "Build and explain dashboards for stakeholders.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Microsoft Learn Power BI path", "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi" },
            { "type": "learn", "label": "Power BI Full Course (Video)", "url": "https://www.youtube.com/watch?v=OC08_LnKZFk" }
          ],
          "tests": [
            { "type": "test", "label": "Power BI dashboard module", "url": "https://learn.microsoft.com/en-us/training/modules/create-dashboards-power-bi/" }
          ]
        },
        {
          "order": 8,
          "title": "Capstone Case Study",
          "estimatedMinutes": 180,
          "subtopics": ["End-to-end analysis", "Portfolio writeup", "Presentation"],
          "outcome": "Ship a portfolio-grade case study.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Capstone expectations reference", "url": "https://www.coursera.org/professional-certificates/google-data-analytics" },
            { "type": "learn", "label": "Data Analytics Portfolio Project (Video)", "url": "https://www.youtube.com/watch?v=Dnch98Zf2ks" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Retail Superstore Sales Dashboard",
          "problem": "Analyze sales/profit trends and recommend actions.",
          "tools": ["Excel", "Power BI or Tableau", "SQL (optional)"],
          "deliverables": ["Dashboard", "5 insights", "3 recommendations", "PDF export"]
        },
        {
          "title": "RSVP / Movie SQL Case Study",
          "problem": "Answer business questions using joins/window functions.",
          "tools": ["SQL"],
          "deliverables": ["SQL script", "Results summary", "Optimization notes"]
        },
        {
          "title": "Credit Risk Analysis",
          "problem": "Find drivers of default risk and build a baseline model.",
          "tools": ["Python", "pandas"],
          "deliverables": ["EDA notebook", "Baseline model", "Decision memo"]
        }
      ],
      "mockInterviewChecklist": [
        "Technical: SQL queries (joins, window functions).",
        "Scenario: How would you investigate a drop in metrics?",
        "Visualization: Critique a dashboard or chart.",
        "Behavioral: Tell me about a time you had to explain data to a non-technical stakeholder."
      ]
    },
    {
      "slug": "machine-learning-engineer",
      "title": "Machine Learning Engineer",
      "shortDesc": "End-to-end ML engineering: algorithms, tuning, deep learning basics, GenAI intro, and MLOps deployment.",
      "tags": ["ML", "scikit-learn", "MLOps", "Deployment"],
      "modules": [
        {
          "order": 1,
          "title": "Problem Framing + ML Foundations",
          "estimatedMinutes": 60,
          "subtopics": ["ML project lifecycle", "CRISP-DM framing", "Ethics + data leakage awareness", "Math refresh: vectors/matrices intuition"],
          "outcome": "Convert a business problem into an ML problem with success metrics and constraints.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "CRISP-DM overview", "url": "https://www.datascience-pm.com/crisp-dm-2/" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Python + Data Tooling for ML",
          "estimatedMinutes": 150,
          "subtopics": ["Python essentials", "NumPy arrays", "pandas data manipulation", "Jupyter workflow", "Git/GitHub basics"],
          "outcome": "Build reproducible data workflows in Python and manage code like an engineer.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python official tutorial", "url": "https://docs.python.org/3/tutorial/" },
            { "type": "read", "label": "pandas user guide", "url": "https://pandas.pydata.org/docs/user_guide/index.html" }
          ],
          "tests": [
            { "type": "test", "label": "Python quiz", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 3,
          "title": "Core ML Algorithms (Supervised + Unsupervised)",
          "estimatedMinutes": 240,
          "subtopics": ["Regression + classification basics", "Loss functions intuition", "Regularization (Ridge/Lasso)", "k-means + PCA overview", "Train/test split"],
          "outcome": "Train baseline ML models correctly and understand what’s happening under the hood.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google Machine Learning Crash Course", "url": "https://developers.google.com/machine-learning/crash-course" }
          ],
          "tests": [
            { "type": "test", "label": "MLCC exercises", "url": "https://developers.google.com/machine-learning/crash-course/exercises" }
          ]
        },
        {
          "order": 4,
          "title": "Advanced ML Models + Feature Engineering",
          "estimatedMinutes": 240,
          "subtopics": ["Decision Trees", "Random Forests", "Gradient Boosting concepts", "SVM overview", "Feature importance basics", "Feature engineering patterns"],
          "outcome": "Select strong non-neural baselines and improve them with features + model choices.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "scikit-learn supervised learning overview", "url": "https://scikit-learn.org/stable/supervised_learning.html" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Evaluation + Tuning + Cross Validation",
          "estimatedMinutes": 180,
          "subtopics": ["Cross-validation", "Grid/Random search", "Metrics selection", "Bias/variance tradeoff", "Error analysis + leakage checks"],
          "outcome": "Avoid common evaluation mistakes and tune models safely—interview-ready skill.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "scikit-learn cross-validation guide", "url": "https://scikit-learn.org/stable/modules/cross_validation.html" }
          ],
          "tests": [
            { "type": "test", "label": "scikit-learn MOOC quiz", "url": "https://inria.github.io/scikit-learn-mooc/predictive_modeling_pipeline/02_numerical_pipeline_quiz_m1_02.html" }
          ]
        },
        {
          "order": 6,
          "title": "Deep Learning Foundations",
          "estimatedMinutes": 240,
          "subtopics": ["Neural networks intuition", "Backprop idea", "Activation functions", "Optimization basics", "Build first MLP"],
          "outcome": "Train a basic neural network and understand training dynamics.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "PyTorch quickstart", "url": "https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "NLP + Generative AI Basics",
          "estimatedMinutes": 240,
          "subtopics": ["Tokenization + embeddings", "Transformers overview", "BERT/GPT mental model", "Prompt engineering basics", "Hugging Face workflow"],
          "outcome": "Understand how modern NLP/LLM pipelines work and build a small text model demo.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Hugging Face LLM Course", "url": "https://huggingface.co/learn/llm-course/en/chapter1/1" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "MLOps + Deployment Basics (API + Container)",
          "estimatedMinutes": 240,
          "subtopics": ["Serve model with REST API", "FastAPI basics", "Docker containerization", "Versioning + simple monitoring mindset"],
          "outcome": "Ship a minimal model service that runs consistently and can be demoed to recruiters.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "FastAPI first steps", "url": "https://fastapi.tiangolo.com/tutorial/first-steps/" },
            { "type": "learn", "label": "Docker get started", "url": "https://docs.docker.com/get-started/" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "Interview Prep + ML System Design (Optional)",
          "estimatedMinutes": 120,
          "subtopics": ["Explain bias/variance", "Model selection reasoning", "ML system components", "Behavioral STAR stories for ML projects"],
          "outcome": "Tell a strong ML project story and handle common ML interview patterns.",
          "isOptional": true,
          "resources": [
            { "type": "read", "label": "scikit-learn model evaluation concepts", "url": "https://scikit-learn.org/stable/modules/model_evaluation.html" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Churn Prediction + Intervention Plan",
          "problem": "Predict which users are likely to churn and propose retention actions.",
          "tools": ["Python", "pandas", "scikit-learn"],
          "deliverables": ["EDA notebook", "Model + metrics", "Top drivers explanation", "Action memo (1–2 pages)"]
        },
        {
          "title": "Image Classifier Baseline (Transfer Learning)",
          "problem": "Build an image classifier using a pre-trained model and evaluate performance.",
          "tools": ["PyTorch or TensorFlow", "GPU (optional)"],
          "deliverables": ["Training notebook", "Confusion matrix + metrics", "Error analysis notes", "README + demo steps"]
        },
        {
          "title": "Deployed ML API (Dockerized)",
          "problem": "Deploy one trained model behind an API and package it into a Docker container.",
          "tools": ["FastAPI", "Docker"],
          "deliverables": ["Running API endpoint", "Dockerfile", "Sample curl requests", "README"]
        }
      ],
      "mockInterviewChecklist": [
        "Explain your best ML project end-to-end (problem → data → model → evaluation → impact).",
        "Core ML: overfitting, regularization, bias/variance, metrics selection.",
        "Hands-on: walk through a pipeline in scikit-learn.",
        "Deployment: describe serving, versioning, monitoring basics.",
        "Behavioral: stakeholder conflict + tradeoffs + iteration story."
      ]
    },
    {
      "slug": "artificial-intelligence",
      "title": "Artificial Intelligence",
      "shortDesc": "Deep learning + modern GenAI: transformers, prompt patterns, and applied AI design with ethics.",
      "tags": ["Deep Learning", "Transformers", "GenAI", "Applied AI"],
      "modules": [
        {
          "order": 1,
          "title": "AI Fundamentals + Responsible AI",
          "estimatedMinutes": 90,
          "subtopics": ["AI subfields overview", "Data bias + fairness", "Privacy basics", "What makes AI projects fail"],
          "outcome": "Understand AI landscape and apply responsible AI thinking early.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Generative AI for Everyone", "url": "https://www.youtube.com/watch?v=9tbaiFIm0HU" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Probability + Reasoning (Lightweight)",
          "estimatedMinutes": 120,
          "subtopics": ["Probability basics", "Bayes intuition", "Uncertainty thinking for AI outputs", "Evaluation mindset"],
          "outcome": "Reason about uncertainty and interpret probabilistic outputs.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Khan Academy probability (free)", "url": "https://www.khanacademy.org/math/statistics-probability/probability-library" }
          ],
          "tests": []
        },
        {
          "order": 3,
          "title": "ML Refresher for AI",
          "estimatedMinutes": 150,
          "subtopics": ["Supervised vs unsupervised", "Train/test split", "Metrics", "Overfitting basics"],
          "outcome": "Be fluent in baseline ML concepts before moving to deep learning + GenAI.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google ML Crash Course (concepts)", "url": "https://developers.google.com/machine-learning/crash-course/ml-intro" }
          ],
          "tests": [
            { "type": "test", "label": "MLCC practice questions", "url": "https://developers.google.com/machine-learning/crash-course/exercises" }
          ]
        },
        {
          "order": 4,
          "title": "Neural Networks + Deep Learning Core",
          "estimatedMinutes": 240,
          "subtopics": ["Perceptron → MLP", "Backprop intuition", "Optimization", "Regularization techniques"],
          "outcome": "Train deep learning models and understand training stability.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "TensorFlow quickstart for beginners", "url": "https://www.tensorflow.org/tutorials/quickstart/beginner" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Deep Learning Specializations: Vision + Sequence Models",
          "estimatedMinutes": 240,
          "subtopics": ["CNNs for vision", "RNN/LSTM overview", "Transfer learning", "Practical error analysis"],
          "outcome": "Build a CNN baseline and understand sequence modeling patterns.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "PyTorch vision transfer learning tutorial", "url": "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" }
          ],
          "tests": []
        },
        {
          "order": 6,
          "title": "Transformers + LLMs + Prompting",
          "estimatedMinutes": 240,
          "subtopics": ["Attention idea", "Transformers mental model", "LLM capabilities/limits", "Prompt patterns", "RAG concept familiarity"],
          "outcome": "Build and evaluate a simple LLM workflow and explain tradeoffs in interviews.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Hugging Face Transformers Course", "url": "https://huggingface.co/learn/nlp-course/chapter1/1" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "AI Portfolio + Interview Readiness",
          "estimatedMinutes": 120,
          "subtopics": ["Project storytelling", "Model limitations", "Ethics in interviews", "Demo checklist"],
          "outcome": "Present AI work clearly with strong documentation and realistic claims.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Building an AI Portfolio", "url": "https://www.youtube.com/watch?v=8UwhoPOO9I0" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Mini LLM Q&A App (Prompt + Evaluation)",
          "problem": "Create a Q&A assistant for a small topic set and evaluate response quality with test prompts.",
          "tools": ["Hugging Face (optional)", "Python"],
          "deliverables": ["Prompt set", "Evaluation checklist", "Demo script", "README"]
        },
        {
          "title": "Vision Classifier with Error Analysis",
          "problem": "Train a small CNN/transfer learning model and analyze failure cases.",
          "tools": ["PyTorch or TensorFlow"],
          "deliverables": ["Training notebook", "Top failure examples", "Metric report", "README"]
        },
        {
          "title": "RAG Concept Demo (Optional Advanced)",
          "problem": "Create a tiny retrieval-augmented demo using a small document set and show better answers than raw prompting.",
          "tools": ["Python", "Embeddings (library choice)"],
          "deliverables": ["Pipeline diagram", "Before/after examples", "Evaluation notes", "README"]
        }
      ],
      "mockInterviewChecklist": [
        "Explain transformers at a high level (attention, tokens, context).",
        "How do you evaluate an LLM workflow? (accuracy, safety, hallucinations).",
        "Deep learning basics: training stability, regularization, overfitting.",
        "Responsible AI: bias, privacy, safety constraints.",
        "Portfolio: show demos + limitations + next steps."
      ]
    },
    {
      "slug": "full-stack-developer",
      "title": "Full Stack Developer",
      "shortDesc": "Frontend + backend + databases + auth + testing + deployment for job-ready full stack roles.",
      "tags": ["HTML/CSS", "JavaScript", "React", "Node", "Databases", "Auth", "Deploy"],
      "modules": [
        {
          "order": 1,
          "title": "HTML + CSS Foundations",
          "estimatedMinutes": 240,
          "subtopics": ["Semantic HTML", "Forms", "Flexbox/Grid", "Responsive design basics", "Accessibility basics"],
          "outcome": "Build responsive, structured web pages that convert.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "HTML & CSS Full Course", "url": "https://www.youtube.com/watch?v=LzMnsfqjzkA" }
          ],
          "tests": [
            { "type": "test", "label": "HTML Quiz (W3Schools)", "url": "https://www.w3schools.com/html/html_quiz.asp" }
          ]
        },
        {
          "order": 2,
          "title": "JavaScript Fundamentals + DOM",
          "estimatedMinutes": 360,
          "subtopics": ["Variables/functions", "ES6 basics", "DOM", "Events", "Fetch API"],
          "outcome": "Create interactive UI and call APIs from the browser.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
          ],
          "tests": [
            { "type": "test", "label": "JavaScript Quiz (W3Schools)", "url": "https://www.w3schools.com/js/js_quiz.asp" }
          ]
        },
        {
          "order": 3,
          "title": "Git + Collaboration Workflow",
          "estimatedMinutes": 120,
          "subtopics": ["Commits/branches", "Pull requests", "Merge conflict basics", "README + repo hygiene"],
          "outcome": "Work like a real developer and maintain a strong portfolio repository.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Git & GitHub Crash Course", "url": "https://www.youtube.com/watch?v=Ez8F0nW6S-w" }
          ],
          "tests": [
            { "type": "test", "label": "Git Basics Quiz", "url": "https://www.simplilearn.com/tutorials/git-tutorial/git-interview-questions" }
          ]
        },
        {
          "order": 4,
          "title": "React Fundamentals",
          "estimatedMinutes": 360,
          "subtopics": ["Components/props", "State", "Hooks basics", "Routing", "Forms"],
          "outcome": "Build a modern frontend with reusable components and client-side routing.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "React Full Course", "url": "https://www.youtube.com/watch?v=ZaC6oCIpjR0" }
          ],
          "tests": [
            { "type": "test", "label": "React Quiz (GreatFrontEnd)", "url": "https://www.greatfrontend.com/questions/react" }
          ]
        },
        {
          "order": 5,
          "title": "Node.js Fundamentals",
          "estimatedMinutes": 180,
          "subtopics": ["Event loop intuition", "Modules", "File I/O basics", "Building a simple server", "Environment variables"],
          "outcome": "Understand how JavaScript runs on the server and how to structure backend code.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Node.js Docs - Getting Started", "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs" }
          ],
          "tests": [
            { "type": "test", "label": "Node.js Quiz", "url": "https://www.tutorialspoint.com/nodejs/nodejs_online_quiz.htm" }
          ]
        },
        {
          "order": 6,
          "title": "Express.js + REST APIs",
          "estimatedMinutes": 240,
          "subtopics": ["Routing", "Middleware", "Validation basics", "Error handling patterns", "REST conventions"],
          "outcome": "Build production-style REST APIs with a clean structure.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Express Guide (Official)", "url": "https://expressjs.com/en/guide/routing.html" }
          ],
          "tests": [
            { "type": "test", "label": "REST API Quiz", "url": "https://www.fullstack.cafe/blog/rest-api-interview-questions" }
          ]
        },
        {
          "order": 7,
          "title": "Databases (Postgres + MongoDB Basics)",
          "estimatedMinutes": 300,
          "subtopics": ["Relational modeling basics", "CRUD + joins", "NoSQL modeling basics", "Indexing concept", "DB integration patterns"],
          "outcome": "Persist data reliably and choose the right database pattern.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "MongoDB CRUD (Official Manual)", "url": "https://www.mongodb.com/docs/manual/crud/" }
          ],
          "tests": [
            { "type": "test", "label": "PostgreSQL Quiz", "url": "https://www.tutorialspoint.com/postgresql/postgresql_online_quiz.htm" }
          ]
        },
        {
          "order": 8,
          "title": "Authentication + Authorization",
          "estimatedMinutes": 240,
          "subtopics": ["Sessions vs JWT", "Password hashing", "Protected routes", "RBAC basics", "Security basics"],
          "outcome": "Implement secure authentication and protect routes end-to-end.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "OWASP Authentication Cheat Sheet", "url": "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" }
          ],
          "tests": [
            { "type": "test", "label": "Security Basics Quiz", "url": "https://www.securityknowledgeframework.org/" }
          ]
        },
        {
          "order": 9,
          "title": "Testing + Debugging",
          "estimatedMinutes": 180,
          "subtopics": ["API testing", "Unit tests basics", "Integration tests basics", "Logging patterns", "Debugging workflow"],
          "outcome": "Ship features confidently and debug real production issues faster.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Postman - Writing Test Scripts", "url": "https://learning.postman.com/docs/writing-scripts/test-scripts/" }
          ],
          "tests": [
            { "type": "test", "label": "JavaScript Practice (Codewars)", "url": "https://www.codewars.com/kata/search/javascript?q=&beta=false" }
          ]
        },
        {
          "order": 10,
          "title": "Deployment Basics (Frontend + Backend)",
          "estimatedMinutes": 240,
          "subtopics": ["Build + deploy frontend", "Deploy API", "CORS basics", "Docker basics", "Env config"],
          "outcome": "Deploy a full-stack app with a clear demo URL and reproducible steps.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Vercel Docs - Deploying", "url": "https://vercel.com/docs/deployments/overview" }
          ],
          "tests": [
            { "type": "test", "label": "Web Fundamentals Practice (Frontend Mentor)", "url": "https://www.frontendmentor.io/challenges" }
          ]
        }
      ],
      "projects": [
        {
          "title": "Full Stack MERN Social App (Auth + CRUD)",
          "problem": "Build a social app with login, profiles, posts, likes/comments, and protected routes.",
          "tools": ["React", "Node.js", "Express.js", "MongoDB"],
          "deliverables": ["Auth flow", "Protected APIs", "CRUD features", "Deployment URL", "README + API docs"]
        },
        {
          "title": "E-commerce Store (Cart + Orders + Admin)",
          "problem": "Create product catalog, cart, checkout, and admin product management.",
          "tools": ["React", "Node.js", "Express.js", "PostgreSQL or MongoDB"],
          "deliverables": ["Catalog pages", "Cart and order flow", "Admin CRUD", "Seed data", "Deployment URL"]
        },
        {
          "title": "Job Board (Search + Filters + Saved Jobs)",
          "problem": "Build a job board with search, filters, saved jobs, and user accounts.",
          "tools": ["React", "Node.js", "Express.js", "Database"],
          "deliverables": ["Search/filter UI", "Backend endpoints", "Saved jobs feature", "Basic analytics events (optional)"]
        }
      ],
      "mockInterviewChecklist": [
        "Frontend (20 min): React component design + state + hooks.",
        "Backend (20 min): design 2–3 REST endpoints + validation + error handling.",
        "Database (10 min): schema sketch + query reasoning.",
        "Debugging (10 min): identify bug from snippet + propose fix.",
        "Behavioral (15 min): project walkthrough and tradeoff discussion."
      ]
    },
    {
      "slug": "python-developer",
      "title": "Python Developer",
      "shortDesc": "Python programming + APIs + databases + testing + deployment for backend job readiness.",
      "tags": ["Python", "APIs", "SQL", "Testing", "Deployment"],
      "modules": [
        {
          "order": 1,
          "title": "Python Basics + Programming Fundamentals",
          "estimatedMinutes": 180,
          "subtopics": ["Syntax, variables, data types", "Loops/conditions", "Functions", "Files basics", "Exceptions basics"],
          "outcome": "Write basic scripts and reason about program flow.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python Official Tutorial (Basics)", "url": "https://docs.python.org/3/tutorial/" },
            { "type": "learn", "label": "Python Full Course for Beginners", "url": "https://www.youtube.com/watch?v=UrsmFxEIp5k" }
          ],
          "tests": [
            { "type": "test", "label": "Python Intro Quiz (W3Schools)", "url": "https://www.w3schools.com/python/python_quiz.asp" }
          ]
        },
        {
          "order": 2,
          "title": "Data Structures + Problem Solving",
          "estimatedMinutes": 240,
          "subtopics": ["Lists/Dicts/Sets/Tuples", "String patterns", "Recursion basics", "Common problem patterns"],
          "outcome": "Solve typical coding tasks using correct data structures.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python Data Structures (Real Python - free article)", "url": "https://realpython.com/python-data-structures/" }
          ],
          "tests": [
            { "type": "test", "label": "Python Practice (CodingBat)", "url": "https://codingbat.com/python" }
          ]
        },
        {
          "order": 3,
          "title": "OOP + Code Organization",
          "estimatedMinutes": 180,
          "subtopics": ["Classes/objects", "Inheritance", "Encapsulation", "Dunder methods", "Project structure basics"],
          "outcome": "Write maintainable, modular Python code using OOP.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Python Classes (Official Docs)", "url": "https://docs.python.org/3/tutorial/classes.html" }
          ],
          "tests": [
            { "type": "test", "label": "OOP Quiz (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/quizzes/python-oops-quiz/" }
          ]
        },
        {
          "order": 4,
          "title": "Environment + Packaging (Developer Workflow)",
          "estimatedMinutes": 120,
          "subtopics": ["venv", "pip", "requirements", "imports/modules", "basic packaging concept"],
          "outcome": "Create reproducible environments and manage dependencies.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "venv — Creating Virtual Environments", "url": "https://docs.python.org/3/library/venv.html" }
          ],
          "tests": [
            { "type": "test", "label": "pip Basics (Quick Ref)", "url": "https://pip.pypa.io/en/stable/getting-started/" }
          ]
        },
        {
          "order": 5,
          "title": "SQL + Databases for Python Apps",
          "estimatedMinutes": 240,
          "subtopics": ["Relational basics", "CRUD", "Joins", "Schema basics", "Python DB connection basics"],
          "outcome": "Store and query app data safely and efficiently.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "PostgreSQL Tutorial (Official)", "url": "https://www.postgresql.org/docs/current/tutorial.html" }
          ],
          "tests": [
            { "type": "test", "label": "SQL Practice (SQLZoo)", "url": "https://sqlzoo.net/wiki/SQL_Tutorial" }
          ]
        },
        {
          "order": 6,
          "title": "HTTP + REST API Design",
          "estimatedMinutes": 150,
          "subtopics": ["HTTP methods", "Status codes", "Headers", "REST principles", "Pagination + validation basics"],
          "outcome": "Design APIs that are consistent, debuggable, and interview-ready.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "MDN HTTP Overview", "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" }
          ],
          "tests": [
            { "type": "test", "label": "HTTP Quiz Online", "url": "https://networkwalks.com/http-quiz-online/" }
          ]
        },
        {
          "order": 7,
          "title": "Build APIs With FastAPI",
          "estimatedMinutes": 240,
          "subtopics": ["Routing", "Request/response models", "Validation", "Dependency injection basics", "OpenAPI docs auto"],
          "outcome": "Build production-style Python APIs quickly with strong validation.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "FastAPI First Steps", "url": "https://fastapi.tiangolo.com/tutorial/first-steps/" }
          ],
          "tests": [
            { "type": "test", "label": "API Testing Basics (Postman)", "url": "https://learning.postman.com/docs/writing-scripts/test-scripts/" }
          ]
        },
        {
          "order": 8,
          "title": "Testing + Reliability",
          "estimatedMinutes": 180,
          "subtopics": ["pytest basics", "Fixtures", "Mocking basics", "Integration tests idea", "Coverage mindset"],
          "outcome": "Write tests that prevent regressions and increase confidence.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "pytest Getting Started", "url": "https://docs.pytest.org/en/stable/getting-started.html" }
          ],
          "tests": [
            { "type": "test", "label": "Unit Testing Practice (Exercism Python Track)", "url": "https://exercism.org/tracks/python" }
          ]
        },
        {
          "order": 9,
          "title": "Deployment Basics (Docker)",
          "estimatedMinutes": 180,
          "subtopics": ["Dockerfile basics", "Build/run images", "Environment variables", "Deploy mindset"],
          "outcome": "Ship a reproducible service that runs anywhere.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Docker Get Started", "url": "https://docs.docker.com/get-started/" }
          ],
          "tests": [
            { "type": "test", "label": "Docker Concepts Quiz", "url": "https://kodekloud.com/courses/docker-for-the-absolute-beginner/" }
          ]
        },
        {
          "order": 10,
          "title": "Interview Prep (Python Backend)",
          "estimatedMinutes": 180,
          "subtopics": ["Python core questions", "OOP design basics", "SQL drills", "API design", "Project walkthrough"],
          "outcome": "Explain decisions clearly and perform on core backend interviews.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Python FAQ / Language Reference Index", "url": "https://docs.python.org/3/faq/" }
          ],
          "tests": [
            { "type": "test", "label": "Python Interview Practice (HackerRank Python Domain)", "url": "https://www.hackerrank.com/domains/python" }
          ]
        }
      ],
      "projects": [
        {
          "title": "Task Manager REST API (Auth + CRUD)",
          "problem": "Build a task manager API with user authentication and CRUD endpoints.",
          "tools": ["Python", "FastAPI", "PostgreSQL", "Docker"],
          "deliverables": ["OpenAPI docs", "Auth endpoints", "CRUD endpoints", "DB schema", "Dockerized deploy", "README with curl examples"]
        },
        {
          "title": "E-commerce Mini Backend (Catalog + Orders)",
          "problem": "Create endpoints for products, carts, and order creation with basic validations.",
          "tools": ["Python", "FastAPI", "SQL"],
          "deliverables": ["Entity schemas", "Endpoints", "Sample dataset", "Error handling patterns", "API tests"]
        },
        {
          "title": "Log Processing CLI Tool",
          "problem": "Parse server logs, compute metrics, and output a report (CSV/JSON).",
          "tools": ["Python"],
          "deliverables": ["CLI interface", "Parsing module", "Report output", "Unit tests"]
        }
      ],
      "mockInterviewChecklist": [
        "Warm-up (10 min): Python core (mutability, scope, iterators).",
        "Coding (25 min): data structures problem + clean solution.",
        "Backend Design (15 min): design 2–3 REST endpoints + schema sketch.",
        "Debugging (10 min): read an error log / failing test and propose fix.",
        "Behavioral (15 min): STAR story around a project tradeoff and iteration."
      ]
    },
    {
      "slug": "cloud-computing",
      "title": "Cloud Computing",
      "shortDesc": "Master AWS, Azure, GCP, DevOps, and Containers for cloud architect roles.",
      "tags": ["AWS", "Azure", "GCP", "DevOps", "Docker", "Kubernetes"],
      "modules": [
        {
          "order": 1,
          "title": "Cloud Concepts & Virtualization",
          "estimatedMinutes": 240,
          "subtopics": ["IaaS/PaaS/SaaS models", "Public/Private/Hybrid clouds", "Scalability & Elasticity", "Virtualization basics"],
          "outcome": "Understand core cloud models and design principles.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Cloud Computing Full Course (Edureka)", "url": "https://www.youtube.com/watch?v=EN4fEbcFZ_E" },
            { "type": "read", "label": "Introduction to Cloud Computing (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/cloud-computing/" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Core AWS Services",
          "estimatedMinutes": 300,
          "subtopics": ["EC2, S3, EBS, RDS", "VPC & Networking", "IAM & Security Groups", "ELB & Auto Scaling"],
          "outcome": "Provision and manage core AWS resources securely.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "AWS Cloud Practitioner Crash Course", "url": "https://www.youtube.com/watch?v=3hLmDS179YE" },
            { "type": "read", "label": "AWS Tutorial (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/aws-tutorial/" }
          ],
          "tests": [
            { "type": "test", "label": "AWS Skill Builder Practice Tests", "url": "https://explore.skillbuilder.aws/learn" }
          ]
        },
        {
          "order": 3,
          "title": "Core Azure Services",
          "estimatedMinutes": 300,
          "subtopics": ["Azure VMs & Blob Storage", "App Services & Functions", "VNet & Azure AD", "Security Center"],
          "outcome": "Navigate Azure portal and manage core services.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "AZ-900 Azure Fundamentals Full Course", "url": "https://www.youtube.com/watch?v=NKEFWyqJ5XA" },
            { "type": "read", "label": "Microsoft Azure Tutorial (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/microsoft-azure/" }
          ],
          "tests": [
            { "type": "test", "label": "Microsoft Learn Sandbox Quizzes", "url": "https://learn.microsoft.com/en-us/training/azure/" }
          ]
        },
        {
          "order": 4,
          "title": "Core Google Cloud Services",
          "estimatedMinutes": 240,
          "subtopics": ["Compute Engine & Cloud Storage", "VPC Networking", "BigQuery basics", "GCP Console usage"],
          "outcome": "Understand GCP architecture and data solutions.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google Cloud Full Course for Beginners", "url": "https://www.youtube.com/watch?v=jVE7qKWg8mc" },
            { "type": "read", "label": "Google Cloud Platform Tutorial (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/google-cloud-platform-gcp-tutorial/" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Containers & Orchestration",
          "estimatedMinutes": 300,
          "subtopics": ["Docker basics & Images", "Kubernetes fundamentals", "Pods & Deployments", "Container networking"],
          "outcome": "Build, ship, and run containerized applications.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Docker Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo" },
            { "type": "learn", "label": "Kubernetes Tutorial for Beginners", "url": "https://www.youtube.com/watch?v=X48VuDVv0do" }
          ],
          "tests": []
        },
        {
          "order": 6,
          "title": "CI/CD Pipelines",
          "estimatedMinutes": 240,
          "subtopics": ["Git basics", "Jenkins pipelines", "GitHub Actions", "Automated testing & deployment"],
          "outcome": "Automate software delivery with CI/CD pipelines.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Jenkins Complete Course", "url": "https://www.youtube.com/watch?v=FX322RVNGj4" },
            { "type": "read", "label": "Jenkins Tutorial (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/jenkins/" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "Infrastructure as Code (IaC)",
          "estimatedMinutes": 240,
          "subtopics": ["Terraform basics", "Declarative config", "State management", "CloudFormation/ARM overview"],
          "outcome": "Provision infrastructure using code.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Terraform Crash Course", "url": "https://www.youtube.com/watch?v=SLB_c_ayRMo" },
            { "type": "read", "label": "Intro to Terraform (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/introduction-to-terraform/" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Advanced Cloud Features",
          "estimatedMinutes": 180,
          "subtopics": ["Load Balancing & Auto Scaling", "Serverless (Lambda/Functions)", "Caching & CDNs", "Monitoring (CloudWatch/Prometheus)"],
          "outcome": "Design high-availability and observable systems.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "AWS Serverless", "url": "https://aws.amazon.com/serverless/" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "Cloud Security & Governance",
          "estimatedMinutes": 180,
          "subtopics": ["IAM Best Practices", "Network Security (NACLs/SGs)", "Encryption & Compliance", "Cost Management"],
          "outcome": "Secure cloud environments and manage costs.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "AWS Security Whitepapers", "url": "https://aws.amazon.com/whitepapers/?whitepapers-main.sort-by=item.additionalFields.sortDate&whitepapers-main.sort-order=desc&awsf.whitepapers-content-type=content-type%23security-compliance-privacy" }
          ],
          "tests": []
        },
        {
          "order": 10,
          "title": "Big Data & AI on Cloud",
          "estimatedMinutes": 180,
          "subtopics": ["Managed Data Services", "AI/ML Tools (SageMaker/Vertex)", "Data Pipelines", "GenAI on Cloud"],
          "outcome": "Leverage cloud services for data and AI workloads.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Google Cloud AI", "url": "https://cloud.google.com/products/ai" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Scalable Web App on Multi-AZ Cloud",
          "problem": "Design an autoscaling e-commerce site with zero downtime.",
          "tools": ["AWS (EC2, RDS, ELB)", "Terraform"],
          "deliverables": ["Terraform scripts", "Architecture diagram", "Deployed app demo"]
        },
        {
          "title": "Serverless Data Pipeline",
          "problem": "Ingest, process, and visualize streaming data using serverless tech.",
          "tools": ["AWS Lambda", "Kinesis", "DynamoDB", "QuickSight"],
          "deliverables": ["Pipeline code", "Processed data", "Visualization dashboard"]
        },
        {
          "title": "Cross-Cloud CI/CD Orchestration",
          "problem": "Automate multi-cloud deployments from a single codebase.",
          "tools": ["GitHub Actions/Jenkins", "Kubernetes (EKS/AKS)"],
          "deliverables": ["CI/CD config files", "Deployed services on AWS & Azure"]
        }
      ],
      "mockInterviewChecklist": [
        "Technical: Design a secure, fault-tolerant cloud network.",
        "Scenario: How would you handle a sudden traffic spike or region failure?",
        "Whiteboard: Draw a multi-tier architecture on AWS.",
        "Behavioral: Describe a time you optimized cloud costs or handled an outage."
      ]
    },
    {
      "slug": "cybersecurity",
      "title": "Cybersecurity",
      "shortDesc": "Comprehensive Cyber defense: Network security, SOC, GRC, and Ethical Hacking.",
      "tags": ["Network Security", "SOC", "Ethical Hacking", "GRC"],
      "modules": [
        {
          "order": 1,
          "title": "Security Concepts & OS/Networking Basics",
          "estimatedMinutes": 240,
          "subtopics": ["CIA Triad & Threat Models", "TCP/IP, DNS, IP", "Linux Commands", "Access Control"],
          "outcome": "Master fundamental networking and security concepts.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "CCNA Full Course (Networking)", "url": "https://www.youtube.com/watch?v=H8W9oMNSuwo" },
            { "type": "read", "label": "OSI Model & TCP/IP (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/layers-of-osi-model/" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "InfoSec & Network Security",
          "estimatedMinutes": 240,
          "subtopics": ["Cryptography (SSL/Hashing)", "Firewalls & VPNs", "Packet Analysis", "Intrusion Detection"],
          "outcome": "Analyze network traffic and secure perimeters.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Network Security Basics", "url": "https://www.youtube.com/watch?v=inWWhr5tnEA" },
            { "type": "read", "label": "Network Security Concepts (GeeksforGeeks)", "url": "https://www.geeksforgeeks.org/network-security/" }
          ],
          "tests": []
        },
        {
          "order": 3,
          "title": "Systems & Application Security",
          "estimatedMinutes": 240,
          "subtopics": ["OS Hardening", "OWASP Top 10", "Endpoint Protection (EDR)", "Secure Coding Awareness"],
          "outcome": "Identify and mitigate system and application vulnerabilities.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "OWASP Juice Shop (Hacking Lab)", "url": "https://owasp.org/www-project-juice-shop/" }
          ],
          "tests": []
        },
        {
          "order": 4,
          "title": "Cloud Security & DevSecOps",
          "estimatedMinutes": 240,
          "subtopics": ["Cloud IAM & Encryption", "DevOps Pipeline Security", "Container Security", "Cloud Config Tools"],
          "outcome": "Integrate security into cloud and DevOps workflows.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "AWS Security Fundamentals", "url": "https://aws.amazon.com/security/" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Governance, Risk & Compliance (GRC)",
          "estimatedMinutes": 180,
          "subtopics": ["ISO 27001, NIST, GDPR", "Risk Assessment", "Security Policies", "Audit Prep"],
          "outcome": "Understand compliance frameworks and risk management.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "ISO 27001 Fundamentals", "url": "https://www.youtube.com/watch?v=tvd1MUf3aHE" },
            { "type": "read", "label": "GDPR & IT Governance", "url": "https://gdpr.eu/what-is-gdpr/" }
          ],
          "tests": []
        },
        {
          "order": 6,
          "title": "SOC & Threat Intelligence",
          "estimatedMinutes": 240,
          "subtopics": ["SIEM Alerting", "Incident Response", "Threat Hunting", "MITRE ATT&CK Framework"],
          "outcome": "Monitor, detect, and respond to security incidents.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "MITRE ATT&CK Framework", "url": "https://attack.mitre.org/" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "Ethical Hacking & Forensics",
          "estimatedMinutes": 300,
          "subtopics": ["Penetration Testing Phases", "Reconnaissance & Scanning", "Exploitation", "Basic Forensics"],
          "outcome": "Perform ethical hacking and basic forensic investigations.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Ethical Hacking Full Course", "url": "https://www.youtube.com/watch?v=3Kq1MIfTWCE" },
            { "type": "read", "label": "Ethical Hacking Overview (Tutorialspoint)", "url": "https://www.tutorialspoint.com/ethical_hacking/index.htm" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Certification Alignment",
          "estimatedMinutes": 180,
          "subtopics": ["CompTIA Security+ Prep", "CEH/CISSP Concepts", "Exam Strategies", "Domain Review"],
          "outcome": "Prepare for industry-standard cybersecurity certifications.",
          "isOptional": false,
          "resources": [
            { "type": "test", "label": "ExamCompass Security+ Quizzes", "url": "https://www.examcompass.com/comptia/security-plus-certification/free-security-plus-practice-tests" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "Practical Labs & Tools Proficiency",
          "estimatedMinutes": 240,
          "subtopics": ["Wireshark & Nmap Mastery", "Metasploit & Burp Suite", "Live Fire Labs", "Tool Scenarios"],
          "outcome": "Gain hands-on experience with essential security tools.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "TryHackMe Free Labs", "url": "https://tryhackme.com/" }
          ],
          "tests": []
        },
        {
          "order": 10,
          "title": "Interview Prep & Mock Scenarios",
          "estimatedMinutes": 180,
          "subtopics": ["Incident Response Scenarios", "Technical Q&A", "Project Walkthroughs", "Whiteboard Challenges"],
          "outcome": "Ace cybersecurity interviews with practical and behavioral readiness.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Cybersecurity Interview Prep (Video)", "url": "https://www.youtube.com/watch?v=v0el2gamx0Q" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Enterprise Network Audit & Incident Response",
          "problem": "Detect a breach from network logs and draft an incident response plan.",
          "tools": ["Wireshark", "Splunk/Wazuh", "Kali Linux"],
          "deliverables": ["Incident report", "Secure network diagram", "Mitigation plan"]
        },
        {
          "title": "Secure Application Deployment (DevSecOps)",
          "problem": "Build and deploy a web service with automated security scans.",
          "tools": ["Docker", "Jenkins", "OWASP ZAP"],
          "deliverables": ["CI/CD pipeline script", "Vulnerability reports", "Hardened container images"]
        },
        {
          "title": "Cloud Penetration Testing Capstone",
          "problem": "Identify misconfigurations in a mock AWS environment.",
          "tools": ["AWS CLI", "Nmap", "Burp Suite"],
          "deliverables": ["Pentest report", "Findings & Recommendations", "Remediation steps"]
        }
      ],
      "mockInterviewChecklist": [
        "Scenario: How would you contain a ransomware attack?",
        "Technical: Analyze this packet capture (what is happening?)",
        "Tools: Walk me through how you use Nmap for recon.",
        "Behavioral: Tell me about a security project you led or a vulnerability you found."
      ]
    },
    {
      "slug": "business-analytics",
      "title": "Business Analyst",
      "shortDesc": "BA role, requirements, process modeling, SQL, and Agile practices.",
      "tags": ["SQL", "Excel", "Process Modeling", "Requirements"],
      "modules": [
        {
          "order": 1,
          "title": "Introduction to Business Analysis",
          "estimatedMinutes": 120,
          "subtopics": ["BA role vs Data Analyst", "BABOK knowledge areas", "Requirements lifecycle", "Planning and monitoring"],
          "outcome": "Understand the BA profession and core responsibilities.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Simplilearn Free BA Course", "url": "https://www.simplilearn.com/cbap-basics-skillup" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "Requirement Elicitation & Documentation",
          "estimatedMinutes": 180,
          "subtopics": ["Stakeholder interviews", "User stories vs Use cases", "BRD structure", "Backlog grooming"],
          "outcome": "Elicit and document clear, testable requirements.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Requirement Elicitation Guide", "url": "https://www.youtube.com/watch?v=CHlHApBxLBk&t=420s" }
          ],
          "tests": []
        },
        {
          "order": 3,
          "title": "Process Modeling & UML",
          "estimatedMinutes": 240,
          "subtopics": ["Flowcharts & BPMN", "Swimlanes", "UML Use Case diagrams", "Activity diagrams"],
          "outcome": "Map business processes visually to identify improvements.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Lucidchart Process Mapping Guide", "url": "https://www.lucidchart.com/pages/process-mapping" }
          ],
          "tests": []
        },
        {
          "order": 4,
          "title": "Data Analysis & Visualization",
          "estimatedMinutes": 300,
          "subtopics": ["Excel Pivot Tables/VLOOKUP", "SQL SELECT/JOIN", "Data cleaning", "Basic dashboards"],
          "outcome": "Analyze data to support business decisions.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "edX: Analyzing and Visualizing Data with Excel (Audit)", "url": "https://www.edx.org/learn/excel/microsoft-analyzing-and-visualizing-data-with-excel" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Requirements Analysis & Agile BA Practices",
          "estimatedMinutes": 180,
          "subtopics": ["Prioritization (MoSCoW, Kano)", "Gap analysis", "As-is vs To-be", "BA role in Scrum"],
          "outcome": "Prioritize requirements and work effectively in Agile teams.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Agile BA Guide (Bridging the Gap)", "url": "https://www.bridging-the-gap.com/agile-business-analyst/" }
          ],
          "tests": []
        },
        {
          "order": 6,
          "title": "Stakeholder & Communication Skills",
          "estimatedMinutes": 120,
          "subtopics": ["Stakeholder mapping", "Communication plans", "Facilitation", "Conflict resolution"],
          "outcome": "Manage stakeholder expectations and communicate clearly.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Stakeholder Management Skills", "url": "https://www.youtube.com/watch?v=qGWHuU8jF8M" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "Project & Risk Management Fundamentals",
          "estimatedMinutes": 180,
          "subtopics": ["Scope definition", "WBS basics", "Risk identification", "Traceability matrices"],
          "outcome": "Support project delivery and manage risks.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Google Project Management Certificate (Audit)", "url": "https://www.coursera.org/professional-certificates/google-project-management" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Advanced Analytics for BA",
          "estimatedMinutes": 240,
          "subtopics": ["Predictive analytics concepts", "Intro to R/Python for BAs", "Regression in Excel"],
          "outcome": "Understand advanced analytics to collaborate with data teams.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Khan Academy SQL", "url": "https://www.khanacademy.org/computing/computer-programming/sql" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "Interview Ready (BA Prep)",
          "estimatedMinutes": 180,
          "subtopics": ["Market sizing cases", "System design scenarios", "Behavioral questions", "BABOK queries"],
          "outcome": "Ace BA interviews with structured problem solving.",
          "isOptional": false,
          "resources": [
            { "type": "test", "label": "TestDome Business Analyst Test", "url": "https://www.testdome.com/tests/business-analyst-test/266" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "Process Improvement Case",
          "problem": "Analyze a slow bank loan approval process and suggest improvements.",
          "tools": ["Visio/Draw.io", "Excel"],
          "deliverables": ["As-is/To-be diagrams", "Requirements doc", "Gap analysis"]
        },
        {
          "title": "Data Analysis for Decision Making",
          "problem": "Investigate declining sales data and recommend actions.",
          "tools": ["Excel", "SQL"],
          "deliverables": ["Analysis report", "Charts/Trends", "Recommendations"]
        },
        {
          "title": "Software Requirements Spec",
          "problem": "Define requirements for a new CRM module.",
          "tools": ["Confluence", "Lucidchart"],
          "deliverables": ["FRD with user stories", "UML Use Case diagram", "Data Flow Diagram"]
        }
      ],
      "mockInterviewChecklist": [
        "Technical: SQL queries, UML/DFD drawing exercises.",
        "Case: Process bottleneck analysis and solution proposal.",
        "Behavioral: Conflict with stakeholder (STAR method).",
        "Domain: Explain a complex requirement to a developer."
      ]
    },
    {
      "slug": "product-management",
      "title": "Product Management",
      "shortDesc": "PM fundamentals, execution, metrics, and interviews.",
      "tags": ["Roadmaps", "Metrics", "Strategy", "Leadership"],
      "modules": [
        {
          "order": 1,
          "title": "Introduction to Product Management",
          "estimatedMinutes": 180,
          "subtopics": ["Roles & Responsibilities", "Product Lifecycle", "Market Research", "Vision & Strategy"],
          "outcome": "Define a mock product’s vision and roadmap outline.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "upGrad Free Intro to PM Course", "url": "https://www.upgrad.com/free-courses/it-technology/introduction-to-product-management-free-course/" }
          ],
          "tests": []
        },
        {
          "order": 2,
          "title": "User Research & Design Thinking",
          "estimatedMinutes": 240,
          "subtopics": ["User Interviews", "Personas", "Journey Maps", "Design Thinking"],
          "outcome": "Develop user personas and a journey map.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Coursera: Design Thinking for Innovation (Audit)", "url": "https://www.coursera.org/learn/uva-darden-design-thinking-innovation" }
          ],
          "tests": []
        },
        {
          "order": 3,
          "title": "Agile & Scrum Fundamentals",
          "estimatedMinutes": 180,
          "subtopics": ["Agile Principles", "Scrum Roles", "Sprints", "User Stories"],
          "outcome": "Plan a 2-week sprint with user stories.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "The Scrum Guide", "url": "https://scrumguides.org/scrum-guide.html" }
          ],
          "tests": []
        },
        {
          "order": 4,
          "title": "Product Strategy & Roadmapping",
          "estimatedMinutes": 240,
          "subtopics": ["Product-Market Fit", "SWOT/Porter's 5", "Prioritization (RICE, MoSCoW)", "Roadmap Creation"],
          "outcome": "Build a multi-release roadmap with prioritized features.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Product School: Product Roadmaps Guide", "url": "https://productschool.com/blog/product-management-2/product-roadmaps/" }
          ],
          "tests": []
        },
        {
          "order": 5,
          "title": "Metrics & Analytics",
          "estimatedMinutes": 240,
          "subtopics": ["Key Metrics (DAU/MAU)", "OKRs", "A/B Testing Basics", "Conversion Rates"],
          "outcome": "Analyze a dataset to calculate metrics and propose an A/B test.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Product Metrics Guide (Video)", "url": "https://www.youtube.com/watch?v=N-Igkw7__z0&t=7611s" }
          ],
          "tests": []
        },
        {
          "order": 6,
          "title": "Growth & Marketing Essentials",
          "estimatedMinutes": 180,
          "subtopics": ["GTM Strategy", "Growth Hacking", "Funnel Optimization", "Acquisition Channels"],
          "outcome": "Design a basic go-to-market campaign outline.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Mind the Product: Growth Articles", "url": "https://www.mindtheproduct.com/tag/growth/" }
          ],
          "tests": []
        },
        {
          "order": 7,
          "title": "Product Leadership & Team Management",
          "estimatedMinutes": 180,
          "subtopics": ["Cross-functional Leadership", "Stakeholder Management", "Negotiation", "Communication"],
          "outcome": "Conduct a stakeholder meeting simulation.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Mind the Product: Leadership Articles", "url": "https://www.mindtheproduct.com/tag/leadership/" }
          ],
          "tests": []
        },
        {
          "order": 8,
          "title": "Emerging Trends & Innovation",
          "estimatedMinutes": 120,
          "subtopics": ["AI/ML in Product", "GenAI Tools", "Innovation Frameworks", "Trend Spotting"],
          "outcome": "Propose an innovative feature leveraging new tech.",
          "isOptional": false,
          "resources": [
            { "type": "read", "label": "Silicon Valley Product Group Blog", "url": "https://svpg.com/articles/" }
          ],
          "tests": []
        },
        {
          "order": 9,
          "title": "Interview Ready (PM Prep)",
          "estimatedMinutes": 240,
          "subtopics": ["Product Design Cases (CIRCLES)", "Estimation Questions", "Behavioral Prep", "Mock Interviews"],
          "outcome": "Solve a sample PM interview case.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "HelloPM Mock Interviews Guide", "url": "https://hellopm.co/what-are-mock-interviews/" }
          ],
          "tests": []
        },
        {
          "order": 10,
          "title": "Product Portfolio & Storytelling",
          "estimatedMinutes": 120,
          "subtopics": ["Documenting Projects", "Resume Building", "Personal Branding", "Portfolio Artifacts"],
          "outcome": "Build a product portfolio with past projects.",
          "isOptional": false,
          "resources": [
            { "type": "learn", "label": "Building a PM Portfolio (Video)", "url": "https://www.youtube.com/watch?v=Nrw2h7tiwUw" }
          ],
          "tests": []
        }
      ],
      "projects": [
        {
          "title": "New Product Launch Case",
          "problem": "Plan the end-to-end launch of a new mobile app for e-commerce.",
          "tools": ["Excel", "Figma", "Google Analytics"],
          "deliverables": ["PRD", "Roadmap", "User Personas", "Marketing Plan"]
        },
        {
          "title": "Feature Prioritization Exercise",
          "problem": "Decide the next release scope from a list of feature requests.",
          "tools": ["Aha!/Trello", "Spreadsheets"],
          "deliverables": ["Prioritized List (RICE/MoSCoW)", "One-page Roadmap", "Justification"]
        },
        {
          "title": "Growth Metrics Dashboard",
          "problem": "Analyze user data to drive growth decisions for a subscription service.",
          "tools": ["Google Analytics", "Tableau/Power BI"],
          "deliverables": ["Interactive Dashboard", "Insights Report", "Recommended Experiments"]
        }
      ],
      "mockInterviewChecklist": [
        "Product Design: Design X for Y (CIRCLES framework).",
        "Metrics: What success metrics would you track for [Product]?",
        "Estimation: Estimate the market size for [Product].",
        "Behavioral: Tell me about a time you managed a difficult stakeholder.",
        "Strategy: How would you improve [Product]?"
      ]
    }
  ]
};

let USER_COURSE_PROGRESS: Record<string, UserCourseProgressState> = {};

// --- Projects API ---

export const getProjects = async (): Promise<Project[]> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    const q = query(
      collection(db, 'projects'),
      where('members', 'array-contains', currentUser.uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Must be logged in to create a project");

  const newProject = {
    name: projectData.name || 'Untitled Project',
    description: projectData.description || '',
    visibility: projectData.visibility || 'Private',
    members: [currentUser.uid],
    createdAt: new Date().toISOString(),
    ...projectData,
  };

  const docRef = await addDoc(collection(db, 'projects'), newProject);
  return { id: docRef.id, ...newProject } as Project;
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Must be logged in");

  const ref = doc(db, 'projects', projectId);
  await updateDoc(ref, updates);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Must be logged in");

  const ref = doc(db, 'projects', projectId);
  await deleteDoc(ref);
};

export const getProjectTasks = async (projectId: string): Promise<Column[]> => {
  try {
    const q = query(collection(db, `projects/${projectId}/columns`));
    const snap = await getDocs(q);
    if (snap.empty) {
      return [];
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Column)).sort((a, b) => {
      const order = ['Backlog', 'In Progress', 'Review', 'Done'];
      return order.indexOf(a.id) - order.indexOf(b.id);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const saveProjectTasks = async (projectId: string, columns: Column[]): Promise<void> => {
  // Overwrite the columns entirely for simplicity in MVP
  try {
    for (const col of columns) {
      const ref = doc(db, `projects/${projectId}/columns`, col.id);
      await setDoc(ref, col);
    }
  } catch (error) {
    console.error("Failed to save tasks", error);
  }
};

export const api = {

  // --- Project API ---
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
  saveProjectTasks,

  // --- Profile API ---
  async getProfile(): Promise<UserProfile> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newProfile = { ...INITIAL_PROFILE, id: user.uid, email: user.email || '' };
      await setDoc(docRef, newProfile);
      return newProfile;
    }
    return docSnap.data() as UserProfile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Server-side validation simulation
    if (updates.first_name !== undefined && (updates.first_name.length < 2 || updates.first_name.length > 100)) {
      throw new Error("First name must be between 2 and 100 characters.");
    }
    if (updates.last_name !== undefined && (updates.last_name.length < 2 || updates.last_name.length > 100)) {
      throw new Error("Last name must be between 2 and 100 characters.");
    }
    if (updates.bio && updates.bio.length > 250) {
      throw new Error("Bio cannot exceed 250 characters.");
    }
    if (updates.skills && (updates.skills.length < 1 || updates.skills.length > 10)) {
      throw new Error("Please add between 1 and 10 skills.");
    }
    if (updates.availability) {
      for (const slot of updates.availability) {
        if (slot.start_time >= slot.end_time) {
          throw new Error("Start time must be before end time.");
        }
      }
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    let currentProfile = docSnap.exists() ? docSnap.data() as UserProfile : { ...INITIAL_PROFILE, id: user.uid, email: user.email || '' };

    // Merge updates
    const updatedProfile = { ...currentProfile, ...updates, updated_at: new Date().toISOString() };

    // Recalculate completion
    updatedProfile.profile_completion_percentage = calculateProfileCompletion(updatedProfile);

    await setDoc(docRef, updatedProfile, { merge: true });
    return updatedProfile;
  },

  async uploadPhoto(file: File): Promise<{ photo_url: string }> {
    await delay(1000);
    // Simulate upload
    if (file.size > 5 * 1024 * 1024) throw new Error("File size exceeds 5MB limit.");
    if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error("Invalid file type. Only JPG/PNG allowed.");

    const mockUrl = URL.createObjectURL(file);
    CURRENT_USER_PROFILE.photo_url = mockUrl;
    CURRENT_USER_PROFILE.profile_completion_percentage = calculateProfileCompletion(CURRENT_USER_PROFILE);
    return { photo_url: mockUrl };
  },

  async uploadResume(file: File): Promise<{ resume_url: string }> {
    await delay(1000);
    if (file.size > 8 * 1024 * 1024) throw new Error("File size exceeds 8MB limit.");
    if (file.type !== 'application/pdf') throw new Error("Only PDF files are allowed.");

    const mockUrl = URL.createObjectURL(file);
    CURRENT_USER_PROFILE.resume_url = mockUrl;
    CURRENT_USER_PROFILE.profile_completion_percentage = calculateProfileCompletion(CURRENT_USER_PROFILE);
    return { resume_url: mockUrl };
  },

  async verifyEmail(): Promise<boolean> {
    await delay(500);
    CURRENT_USER_PROFILE.email_verified = true;
    CURRENT_USER_PROFILE.profile_completion_percentage = calculateProfileCompletion(CURRENT_USER_PROFILE);
    return true;
  },

  async getMissingChecklist(): Promise<string[]> {
    await delay(200);
    const p = CURRENT_USER_PROFILE;
    const missing: string[] = [];

    if (!p.first_name || !p.last_name) missing.push("Full Name");
    if (!p.skills || p.skills.length === 0) missing.push("At least 1 Skill");
    if (!p.target_role) missing.push("Target Role");
    if (!p.is_available_for_interview) missing.push("Availability Toggle ON");
    if (!p.timezone) missing.push("Timezone");
    if (!p.availability || p.availability.length === 0) missing.push("At least 1 Availability Slot");
    if (!p.email_verified) missing.push("Email Verification");
    if (p.profile_completion_percentage < 60) missing.push("Profile Completion >= 60%");

    return missing;
  },
  // --- User & Profile ---
  getUserProfile: async (userId: string): Promise<UserProfile> => {
    await delay(300);
    return CURRENT_USER_PROFILE;
  },

  // --- Mock Interviews ---
  getPeers: async (searchQuery?: string): Promise<InterviewPartner[]> => {
    await delay(300); // Faster for UI
    if (!searchQuery) return PEERS;
    const lowerQ = searchQuery.toLowerCase();
    // Search by name or tag (skill)
    return PEERS.filter(p =>
      p.name.toLowerCase().includes(lowerQ) ||
      p.skills.some(s => s.toLowerCase().includes(lowerQ))
    );
  },

  getSchedule: async (): Promise<{ pending: MockSession[], confirmed: MockSession[], completed: MockSession[] }> => {
    const user = auth.currentUser;
    if (!user) return { pending: [], confirmed: [], completed: [] };

    const q1 = query(collection(db, 'sessions'), where('inviter_id', '==', user.uid));
    const q2 = query(collection(db, 'sessions'), where('invitee_id', '==', user.uid));

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const allSessions = new Map<string, MockSession>();

    snap1.forEach(d => allSessions.set(d.id, { id: d.id, ...d.data() } as MockSession));
    snap2.forEach(d => allSessions.set(d.id, { id: d.id, ...d.data() } as MockSession));

    const sorted = Array.from(allSessions.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return {
      pending: sorted.filter(s => s.status === 'pending'),
      confirmed: sorted.filter(s => s.status === 'confirmed'),
      completed: sorted.filter(s => ['completed', 'cancelled'].includes(s.status))
    };
  },

  inviteUser: async (payload: { invitee_id: string, proposed_times: string[], meeting_link: string, message: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // In reality, you'd fetch the partner profile from Firestore. Using fallback values for now.
    const newSessionData = {
      inviter_id: user.uid,
      invitee_id: payload.invitee_id,
      partner_name: "Peer Student",
      partner_avatar: "",
      partner_role: 'Peer',
      proposed_times: payload.proposed_times.join(', '),
      meeting_link: payload.meeting_link,
      status: 'pending',
      created_at: new Date().toISOString(),
      skill_tags: [] // would be partner's skills
    };

    const docRef = await addDoc(collection(db, 'sessions'), newSessionData);
    return { success: true, invite_id: docRef.id };
  },

  cancelSession: async (sessionId: string) => {
    const docRef = doc(db, 'sessions', sessionId);
    await updateDoc(docRef, { status: 'cancelled' });
    return { success: true };
  },

  updateSessionNotes: async (sessionId: string, notes: string) => {
    const docRef = doc(db, 'sessions', sessionId);
    await updateDoc(docRef, { notes_private: notes });
    return { success: true };
  },

  // --- Feedback ---
  submitFeedback: async (payload: Omit<Feedback, 'id' | 'created_at'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const feedbackData = {
      ...payload,
      reviewer_id: user.uid,
      created_at: new Date().toISOString()
    };

    await addDoc(collection(db, 'feedbacks'), feedbackData);

    const sessionRef = doc(db, 'sessions', payload.session_id);
    const sessionSnap = await getDoc(sessionRef);
    if (sessionSnap.exists()) {
      const updates: any = { feedback_status: 'submitted' };
      if (sessionSnap.data().status === 'confirmed') {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
      }
      await updateDoc(sessionRef, updates);
    }
    return { success: true };
  },

  getFeedbackForSession: async (sessionId: string): Promise<Feedback | null> => {
    const user = auth.currentUser;
    if (!user) return null;
    const q = query(collection(db, 'feedbacks'), where('session_id', '==', sessionId), where('reviewer_id', '==', user.uid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Feedback;
  },

  getFeedbacksForUser: async (userId: string): Promise<Feedback[]> => {
    const targetId = userId === 'me' ? auth.currentUser?.uid : userId;
    if (!targetId) return [];

    const q = query(collection(db, 'feedbacks'), where('reviewee_id', '==', targetId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Feedback));
  },

  completeSession: async (sessionId: string): Promise<boolean> => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
    return true;
  },

  getMetrics: async (userId: string): Promise<InterviewMetrics> => {
    const targetId = userId === 'me' ? auth.currentUser?.uid : userId;
    if (!targetId) {
      return { practicesCount: 0, avgScore: 0, improvementTrend: 0, readinessScore: 0, confidenceLabel: "Not authenticated" };
    }

    const q = query(collection(db, 'feedbacks'), where('reviewee_id', '==', targetId));
    const snap = await getDocs(q);
    const userFeedbacks = snap.docs.map(d => d.data() as Feedback);

    if (userFeedbacks.length === 0) {
      return { practicesCount: 0, avgScore: 0, improvementTrend: 0, readinessScore: 0, confidenceLabel: "No feedbacks yet" };
    }

    if (userFeedbacks.length < 2) {
      return { practicesCount: userFeedbacks.length, avgScore: 0, improvementTrend: 0, readinessScore: 0, confidenceLabel: "Low confidence (< 2 sessions)" };
    }

    userFeedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const recentFeedbacks = userFeedbacks.slice(0, 20);

    let totalWeightedScore = 0;
    let totalWeight = 0;

    recentFeedbacks.forEach((fb, index) => {
      const weight = 1 * Math.pow(0.95, index);
      const scores = [fb.scores.problem_solving, fb.scores.communication];
      if (fb.scores.code_quality) scores.push(fb.scores.code_quality);
      if (fb.scores.technical_depth) scores.push(fb.scores.technical_depth);

      const avgFeedbackScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      totalWeightedScore += avgFeedbackScore * weight;
      totalWeight += weight;
    });

    const aggregatedScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
    const readinessScore = Math.round((aggregatedScore / 5) * 100);

    return {
      practicesCount: userFeedbacks.length,
      avgScore: readinessScore,
      improvementTrend: 5, // Mock trend
      readinessScore: readinessScore,
      confidenceLabel: `Based on ${userFeedbacks.length} sessions (last 12 months)`
    };
  },

  exportFeedbacksCSV: async (): Promise<string> => {
    await delay(500);
    // Generate CSV string
    const headers = ['Session ID', 'Date', 'Partner', 'Problem Solving', 'Communication', 'Code Quality', 'Technical Depth', 'Notes', 'Tags'];
    const rows = FEEDBACKS.map(f => {
      const session = SESSIONS.find(s => s.id === f.session_id);
      return [
        f.session_id,
        f.created_at,
        session?.partner_name || 'Unknown',
        f.scores.problem_solving,
        f.scores.communication,
        f.scores.code_quality || '-',
        f.scores.technical_depth || '-',
        `"${f.notes.replace(/"/g, '""')}"`,
        `"${f.tags.join(', ')}"`
      ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  },

  generatePracticePlan: async (): Promise<AIPlanTask[]> => {
    await delay(600);
    return [
      { title: "Review SQL JOIN patterns", expected_minutes: 30, steps: ["Read notes", "Solve 3 exercises"], goal: "Improve joins" },
      { title: "Practice 3 medium-level SQL problems", expected_minutes: 45, steps: ["Select 3 random problems"], goal: "Build speed" }
    ];
  },

  // --- Groups API ---
  getGroups: async (): Promise<Group[]> => {
    const snap = await getDocs(collection(db, 'groups'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as Group));
  },

  getMyGroups: async (): Promise<Group[]> => {
    const user = auth.currentUser;
    if (!user) return [];
    const userName = user.displayName || 'User';

    const snap = await getDocs(collection(db, 'groups'));
    const allGroups = snap.docs.map(d => ({ ...d.data(), id: d.id } as Group));
    return allGroups.filter(g => g.ownerId === user.uid || g.ownerId === 'me' || g.members.includes(userName) || g.members.includes('You'));
  },

  getGroupById: async (groupId: string): Promise<Group | undefined> => {
    const docRef = doc(db, 'groups', groupId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return GROUPS.find(g => g.id === groupId); // Fallback to mock for legacy
    return { ...snap.data(), id: snap.id } as Group;
  },

  createGroup: async (group: Omit<Group, 'id' | 'ownerId' | 'members' | 'memberCount' | 'createdAt'>): Promise<Group> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const userName = user.displayName || 'User';

    const newGroup = {
      ...group,
      ownerId: user.uid,
      members: [userName],
      memberCount: 1,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'groups'), newGroup);
    return { ...newGroup, id: docRef.id } as Group;
  },

  updateGroup: async (groupId: string, updates: Partial<Group>): Promise<Group> => {
    const docRef = doc(db, 'groups', groupId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, updates);
      return { ...snap.data(), ...updates, id: snap.id } as Group;
    }
    // Fallback to mock edit if legacy mock group
    const index = GROUPS.findIndex(g => g.id === groupId);
    if (index !== -1) {
      GROUPS[index] = { ...GROUPS[index], ...updates };
      return GROUPS[index];
    }
    throw new Error("Group not found");
  },

  deleteGroup: async (groupId: string): Promise<boolean> => {
    const docRef = doc(db, 'groups', groupId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await deleteDoc(docRef);
      return true;
    }
    // Fallback to mock delete if legacy
    GROUPS = GROUPS.filter(g => g.id !== groupId);
    return true;
  },

  getGroupPosts: async (groupId: string): Promise<Post[]> => {
    const q = query(collection(db, 'posts'), where('groupId', '==', groupId));
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
    // Include mock posts for legacy mock groups
    const mockPosts = POSTS.filter(p => p.groupId === groupId);
    return [...posts, ...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  inviteToGroup: async (groupId: string, emails: string[]): Promise<boolean> => {
    try {
      const docRef = doc(db, 'groups', groupId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const group = snap.data();
        const currentMembers = group.members || [];
        const newMembers = Array.from(new Set([...currentMembers, ...emails]));
        await updateDoc(docRef, { members: newMembers, memberCount: newMembers.length });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  inviteToProject: async (projectId: string, emails: string[]): Promise<boolean> => {
    try {
      const docRef = doc(db, 'projects', projectId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const project = snap.data();
        const currentMembers = project.members || [];
        const newMembers = emails.map(email => ({
          user_id: email.toLowerCase(),
          name: email.split('@')[0],
          role: 'Member',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
        }));
        const updatedMembers = [...currentMembers, ...newMembers];
        await updateDoc(docRef, { members: updatedMembers });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  },


  // --- Community Feed API ---

  getPosts: async (page: number = 1): Promise<Post[]> => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
  },

  createPost: async (content: string, tags: string[], groupId?: string): Promise<Post> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const newPostData = {
      authorId: user.uid,
      author: { name: user.displayName || 'User', avatar: user.displayName?.charAt(0) || 'U', level: 'Beginner', matchPercentage: 100 },
      content,
      tags,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      type: 'note',
      groupId: groupId || null
    };
    const docRef = await addDoc(collection(db, 'posts'), newPostData);
    return { id: docRef.id, ...newPostData, likedByMe: false } as Post;
  },

  updatePost: async (postId: string, content: string): Promise<Post> => {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, { content, updatedAt: new Date().toISOString() });
    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() } as Post;
  },

  deletePost: async (postId: string): Promise<boolean> => {
    await deleteDoc(doc(db, 'posts', postId));
    return true;
  },

  toggleLike: async (postId: string): Promise<{ likes: number, likedByMe: boolean }> => {
    const docRef = doc(db, 'posts', postId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Post not found");
    const data = snap.data();
    const newLikes = (data.likes || 0) + 1; // Simplified increment
    await updateDoc(docRef, { likes: newLikes });
    return { likes: newLikes, likedByMe: true };
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Comment));
  },

  createComment: async (postId: string, text: string): Promise<Comment> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const newCommentData = {
      postId,
      authorId: user.uid,
      author: { name: user.displayName || 'User', avatar: user.displayName?.charAt(0) || 'U' },
      text,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), newCommentData);

    // update comment count on post
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      await updateDoc(postRef, { comments: (postSnap.data().comments || 0) + 1 });
    }

    return { id: docRef.id, ...newCommentData } as Comment;
  },

  updateComment: async (postId: string, commentId: string, text: string): Promise<Comment> => {
    const docRef = doc(db, 'posts', postId, 'comments', commentId);
    await updateDoc(docRef, { text, updatedAt: new Date().toISOString() });
    const snap = await getDoc(docRef);
    return { id: snap.id, ...snap.data() } as Comment;
  },

  deleteComment: async (postId: string, commentId: string): Promise<boolean> => {
    await deleteDoc(doc(db, 'posts', postId, 'comments', commentId));

    // Decrement comment count on post
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (postSnap.exists()) {
      const currentComments = postSnap.data().comments || 0;
      await updateDoc(postRef, { comments: Math.max(0, currentComments - 1) });
    }
    return true;
  },

  // --- Activity Feed API ---
  getMyActivity: async (filter: 'all' | 'groups' | 'posts' | 'comments' = 'all'): Promise<ActivityItem[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const activity: ActivityItem[] = [];

    // Groups
    if (filter === 'all' || filter === 'groups') {
      const myGroups = await api.getMyGroups();
      myGroups.forEach(g => {
        activity.push({
          id: g.id,
          type: 'group',
          title: g.name,
          content: g.description,
          createdAt: g.createdAt,
          metadata: {
            members: g.memberCount,
            role: g.ownerId === user.uid ? 'Owner' : 'Member'
          }
        });
      });
    }

    // Posts & Comments from Firestore
    if (filter === 'all' || filter === 'posts' || filter === 'comments') {
      const pSnap = await getDocs(collection(db, 'posts'));
      const allPosts = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Post));

      if (filter === 'all' || filter === 'posts') {
        const userName = user.displayName || 'User';
        const myPosts = allPosts.filter(p => p.authorId === user.uid || p.author?.name === userName || p.author?.name === 'You');
        myPosts.forEach(p => {
          activity.push({
            id: p.id,
            type: 'post',
            content: p.content,
            createdAt: p.createdAt || new Date().toISOString(),
            metadata: {
              likes: p.likes || 0,
              comments: p.comments || 0,
              tags: p.tags || []
            }
          });
        });
      }

      if (filter === 'all' || filter === 'comments') {
        const userName = user.displayName || 'User';
        for (const p of allPosts) {
          const cSnap = await getDocs(collection(db, 'posts', p.id, 'comments'));
          const myComments = cSnap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)).filter(c => c.authorId === user.uid || c.author?.name === userName || c.author?.name === 'You');

          myComments.forEach(c => {
            activity.push({
              id: c.id,
              type: 'comment',
              content: c.text,
              createdAt: c.createdAt || new Date().toISOString(),
              metadata: {
                postId: p.id,
                postTitle: p.content.substring(0, 30) + (p.content.length > 30 ? '...' : '')
              }
            });
          });
        }
      }
    }

    return activity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getMyStats: async (): Promise<{ groups: number, posts: number, comments: number }> => {
    const user = auth.currentUser;
    if (!user) return { groups: 0, posts: 0, comments: 0 };
    const userName = user.displayName || 'User';

    const myGroups = await api.getMyGroups();
    const groups = myGroups.length;

    let postsCount = 0;
    let commentsCount = 0;

    try {
      const pSnap = await getDocs(collection(db, 'posts'));
      postsCount = pSnap.docs.filter(d => {
        const p = d.data() as Post;
        return p.authorId === user.uid || p.author?.name === userName || p.author?.name === 'You';
      }).length;

      for (const doc of pSnap.docs) {
        const cSnap = await getDocs(collection(db, 'posts', doc.id, 'comments'));
        commentsCount += cSnap.docs.filter(d => {
          const c = d.data() as Comment;
          return c.authorId === user.uid || c.author?.name === userName || c.author?.name === 'You';
        }).length;
      }
    } catch (e) {
      console.error("Failed to get stats", e);
    }

    return { groups, posts: postsCount, comments: commentsCount };
  },

  // --- Chat History API ---
  getConversations: async (): Promise<Conversation[]> => {
    await delay(400);
    return [
      {
        id: 'c1',
        recipientName: 'Sarah Chen',
        recipientAvatar: 'SC',
        lastMessage: 'Sounds good! See you then.',
        timestamp: '2h ago',
        unreadCount: 0
      },
      {
        id: 'c2',
        recipientName: 'David Kim',
        recipientAvatar: 'DK',
        lastMessage: 'Can you help me with this Python script?',
        timestamp: '1d ago',
        unreadCount: 2
      }
    ];
  },

  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    await delay(300);
    // Mocking chat messages for any conversation ID
    return CHAT_MESSAGES;
  },

  sendMessage: async (conversationId: string, text: string): Promise<ChatMessage> => {
    await delay(200);
    return {
      id: `m_${Date.now()}`,
      sender: 'me',
      text,
      timestamp: 'Just now',
      read: false
    };
  },

  // --- Roadmap API ---
  getRoadmap: async (): Promise<RoadmapCategory[]> => {
    await delay(300);
    return ROADMAP_CATEGORIES;
  },

  getRoadmapProgress: async (): Promise<UserRoadmapProgress> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, 'roadmap_progress', user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const initial = getInitialProgress();
      initial.userId = user.uid;
      await setDoc(docRef, initial);
      return initial;
    }
    return snap.data() as UserRoadmapProgress;
  },

  updateModuleStatus: async (moduleId: number, status: ModuleStatus): Promise<UserRoadmapProgress> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, 'roadmap_progress', user.uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Roadmap progress not initialized");

    const progress = snap.data() as UserRoadmapProgress;
    progress.moduleStatuses[moduleId] = status;
    progress.lastUpdated = new Date().toISOString();

    if (status === 'completed') {
      if (!progress.completedModuleIds.includes(moduleId)) {
        progress.completedModuleIds.push(moduleId);
      }

      // Logic to unlock next module in the same category
      const category = ROADMAP_CATEGORIES.find(c => c.modules.some(m => m.id === moduleId));
      if (category) {
        const currentIndex = category.modules.findIndex(m => m.id === moduleId);
        if (currentIndex !== -1 && currentIndex < category.modules.length - 1) {
          const nextModule = category.modules[currentIndex + 1];
          // Only unlock if it was locked
          if (progress.moduleStatuses[nextModule.id] === 'locked') {
            progress.moduleStatuses[nextModule.id] = 'in-progress';
          }
        }
      }

      // Logic to unlock Category 4 (Portfolio) if Cat 1-3 are done
      const isCat1Done = ROADMAP_CATEGORIES[0].modules.every(m => progress.completedModuleIds.includes(m.id));
      const isCat2Done = ROADMAP_CATEGORIES[1].modules.every(m => progress.completedModuleIds.includes(m.id));
      const isCat3Done = ROADMAP_CATEGORIES[2].modules.every(m => progress.completedModuleIds.includes(m.id));

      if (isCat1Done && isCat2Done && isCat3Done) {
        const cat4FirstModule = ROADMAP_CATEGORIES[3].modules[0];
        if (progress.moduleStatuses[cat4FirstModule.id] === 'locked') {
          progress.moduleStatuses[cat4FirstModule.id] = 'in-progress';
        }
      }
    }

    await updateDoc(docRef, { ...progress });
    return progress;
  },

  logRoadmapEvent: async (type: 'resource_click' | 'test_click' | 'module_complete', moduleId: number | string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) return;
    const eventData: any = {
      userId: user.uid,
      type,
      moduleId,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'roadmap_events'), eventData);
    console.log('[Analytics]', eventData);
  },

  // --- Resource Engine ---
  getCatalog: async (): Promise<CatalogData> => {
    await delay(200);
    return CATALOG;
  },

  getCourse: async (slug: string): Promise<CourseData | undefined> => {
    await delay(300);
    return CATALOG.courses.find(c => c.slug === slug);
  },

  getCourseProgress: async (slug: string): Promise<UserCourseProgressState> => {
    const user = auth.currentUser;
    if (!user) {
      return {
        modules: { 1: { status: 'in_progress' } },
        projects: {}
      };
    }
    const docRef = doc(db, 'course_progress', `${user.uid}_${slug}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const initial: UserCourseProgressState = {
        modules: { 1: { status: 'in_progress' } },
        projects: {}
      };
      await setDoc(docRef, initial);
      return initial;
    }
    return snap.data() as UserCourseProgressState;
  },

  markModuleComplete: async (slug: string, moduleOrder: number): Promise<UserCourseProgressState> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, 'course_progress', `${user.uid}_${slug}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Progress not initialized");

    const progress = snap.data() as UserCourseProgressState;
    if (!progress.modules) progress.modules = {};
    progress.modules[moduleOrder] = { status: 'completed' };

    const course = CATALOG.courses.find(c => c.slug === slug);
    if (course && course.modules) {
      const nextModule = course.modules.find(m => m.order === moduleOrder + 1);
      if (nextModule) {
        if (!progress.modules[nextModule.order]) {
          progress.modules[nextModule.order] = { status: 'in_progress' };
        }
      }
    }

    await updateDoc(docRef, { modules: progress.modules });
    return progress;
  },

  markProjectComplete: async (slug: string, projectTitle: string): Promise<UserCourseProgressState> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const docRef = doc(db, 'course_progress', `${user.uid}_${slug}`);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error("Progress not initialized");

    const progress = snap.data() as UserCourseProgressState;
    if (!progress.projects) progress.projects = {};
    progress.projects[projectTitle] = { isCompleted: true };

    await updateDoc(docRef, { projects: progress.projects });
    return progress;
  },

  searchResources: async (query: string): Promise<CourseData[]> => {
    await delay(300);
    const q = query.toLowerCase();
    return CATALOG.courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q)
    );
  }
};

