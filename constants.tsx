
import {
  Users,
  Map,
  MessageSquare,
  BookOpen,
  Briefcase,
  Code,
  TrendingUp,
  Award,
  CheckCircle,
  RefreshCw,
  Star,
  LineChart,
  Zap,
  Clock,
  Video,
  Layout,
  Database,
  Globe,
  Server
} from 'lucide-react';
import { NavItem, Metric, Resource, Skill, Step, Testimonial, FAQItem, Feature, Column, InterviewStat, Mentor, InterviewSession, AITask, PastSession, PracticeTask, DashboardStat, ActiveSkill, UpcomingSession, SavedResourceItem, ActiveProject, Post, SuggestedPeer, ChatMessage } from './types';

// CONFIGURATION FLAGS
export const GROUPS_ENABLED = true;

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Resources', href: '#resources' },
  { label: 'Community', href: '#community' },
  { label: 'Projects', href: '#projects' },
  { label: 'Mock Interviews', href: '#interviews' },
];

export const HERO_METRICS: Metric[] = [
  { label: 'Learners', value: '50K+', icon: Users },
  { label: 'Mock Interviews', value: '10K+', icon: MessageSquare },
  { label: 'Roadmaps', value: '1.4K', icon: Map },
];

export const HERO_PILLS = ['Python', 'React', 'SQL', 'Data Science'];

export const POPULAR_ROADMAPS: Resource[] = [
  {
    id: 'pr-1',
    title: 'SQL Developer',
    type: 'Course',
    author: '',
    rating: 4.8,
    reviews: 120,
    duration: '9 hours',
    level: 'Beginner',
    image: '',
    why: 'Master SQL from scratch: queries, joins, database design, and performance tuning for data roles.',
    tags: ['SQL', 'Data'],
    provider: 'Pathfinder',
    slug: 'sql-developer'
  },
  {
    id: 'pr-2',
    title: 'Data Science',
    type: 'Course',
    author: '',
    rating: 4.8,
    reviews: 120,
    duration: '23 hours',
    level: 'Intermediate',
    image: '',
    why: 'Math + Python + SQL + ML + optional deep learning + deployment basics.',
    tags: ['Python', 'Data Science', 'Machine Learning'],
    provider: 'Pathfinder',
    slug: 'data-science'
  },
  {
    id: 'pr-3',
    title: 'Data Analytics',
    type: 'Course',
    author: '',
    rating: 4.8,
    reviews: 120,
    duration: '14 hours',
    level: 'Beginner',
    image: '',
    why: 'Excel + SQL + Python + Dashboards + basic statistics for job-ready analytics.',
    tags: ['Excel', 'SQL', 'Python', 'Analytics'],
    provider: 'Pathfinder',
    slug: 'data-analytics'
  },
  {
    id: 'pr-4',
    title: 'Machine Learning Engineer',
    type: 'Course',
    author: '',
    rating: 4.8,
    reviews: 120,
    duration: '29 hours',
    level: 'Advanced',
    image: '',
    why: 'End-to-end ML engineering: algorithms, tuning, deep learning basics, GenAI intro, and MLOps...',
    tags: ['Machine Learning', 'AI', 'MLOps'],
    provider: 'Pathfinder',
    slug: 'machine-learning-engineer'
  }
];

export const CURATED_RESOURCES: Resource[] = [
  {
    id: '4',
    title: 'System Design Interview Guide',
    type: 'Article',
    author: 'Grokking the System Design',
    rating: 4.9,
    reviews: 2100,
    duration: '4 weeks',
    level: 'Advanced',
    image: '',
    why: 'The gold standard for system design interviews. Covers scalability, load balancing, and more.',
    tags: ['System Design', 'Backend', 'Interviews'],
    provider: 'Educative'
  },
  {
    id: '5',
    title: 'Docker for Beginners',
    type: 'Video',
    author: 'TechWorld with Nana',
    rating: 4.8,
    reviews: 500,
    duration: '3 hours',
    level: 'Beginner',
    image: '',
    why: 'Clear, concise introduction to containerization. Essential for modern DevOps.',
    tags: ['Docker', 'DevOps', 'Containers'],
    provider: 'YouTube'
  },
  {
    id: '6',
    title: 'Advanced CSS and Sass',
    type: 'Course',
    author: 'Jonas Schmedtmann',
    rating: 4.9,
    reviews: 300,
    duration: '20 hours',
    level: 'Advanced',
    image: '',
    why: 'Deep dive into modern CSS layouts, animations, and architecture.',
    tags: ['CSS', 'Frontend', 'Design'],
    provider: 'Udemy'
  },
  {
    id: '7',
    title: 'Data Science for Business',
    type: 'Book',
    author: 'O\'Reilly Media',
    rating: 4.6,
    reviews: 150,
    duration: '4 weeks',
    level: 'Intermediate',
    image: '',
    why: 'Focuses on the "why" of data mining and data-analytic thinking.',
    tags: ['Data Science', 'Business', 'Analytics'],
    provider: 'O\'Reilly'
  },
  {
    id: '8',
    title: 'Clean Code',
    type: 'Book',
    author: 'Robert C. Martin',
    rating: 4.8,
    reviews: 5000,
    duration: 'Self-paced',
    level: 'Intermediate',
    image: '',
    why: 'Essential reading for writing maintainable, readable code.',
    tags: ['Software Engineering', 'Best Practices'],
    provider: 'Amazon'
  },
  {
    id: '9',
    title: 'JavaScript: The Good Parts',
    type: 'Book',
    author: 'Douglas Crockford',
    rating: 4.5,
    reviews: 3000,
    duration: 'Self-paced',
    level: 'Advanced',
    image: '',
    why: 'Deep dive into the core mechanics of JavaScript.',
    tags: ['JavaScript', 'Frontend'],
    provider: 'O\'Reilly'
  },
  {
    id: '10',
    title: 'Cracking the Coding Interview',
    type: 'Book',
    author: 'Gayle Laakmann McDowell',
    rating: 4.9,
    reviews: 10000,
    duration: 'Self-paced',
    level: 'Advanced',
    image: '',
    why: 'The bible for technical interview preparation.',
    tags: ['Interviews', 'Algorithms'],
    provider: 'Amazon'
  }
];

export const HOW_IT_WORKS_STEPS: Step[] = [
  { number: 1, title: 'Search or Take Quiz', description: 'Find your skill or take our quick assessment to discover what to learn next' },
  { number: 2, title: 'Follow the Roadmap', description: 'Track progress through curated modules and real-world projects.' },
  { number: 3, title: 'Practice with Peers', description: 'Solidify knowledge by teaching others and practicing interviews.' },
];

// Re-purposing Testimonials for the Outcomes section as per Image 8
export const OUTCOME_TESTIMONIALS = [
  {
    quote: "Pathfinder helped me transition from finance to data science in 6 months. The structured roadmap made everything clear.",
    author: "Sarah Chen",
    role: "Data Scientist @ TechCorp",
    result: "Career change: Finance → Data Science",
    time: "6 months to success",
    rating: 5
  },
  {
    quote: "The peer practice groups were a game-changer. I improved my interview skills and landed 3 offers.",
    author: "Marcus Johnson",
    role: "Software Engineer @ StartupXYZ",
    result: "3 job offers in target companies",
    time: "3 months to success",
    rating: 5
  },
  {
    quote: "From Python beginner to deploying production apps. The mock interviews made the real ones easy.",
    author: "Alex Patel",
    role: "Backend Engineer @ DataCo",
    result: "First dev job, 70K+ salary",
    time: "8 months to success",
    rating: 5
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "The structured roadmaps saved me hundreds of hours of searching. I finally feel confident in my skills.",
    author: "James Wilson",
    role: "Frontend Developer",
    company: "Amazon"
  },
  {
    quote: "I found my study partner here and we both landed jobs at top tech companies. The community is incredible.",
    author: "Elena Rodriguez",
    role: "Software Engineer",
    company: "Microsoft"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  { question: "Is Pathfinder really free?", answer: "Yes. The core roadmaps and community features are free forever. We believe in open access to education." },
  { question: "How much time do I need to commit?", answer: "Our roadmaps are flexible. You can learn at your own pace, whether that's 2 hours a week or 20." },
  { question: "Can I really get a job with Pathfinder?", answer: "Thousands of learners have used our resources to build portfolios that got them hired. We focus on job-ready skills." },
  { question: "Do you offer certificates?", answer: "We focus on portfolio-ready skills, not paper. You'll build projects that prove your competence to employers." },
  { question: "How do mock interviews work?", answer: "You are matched with a peer learning the same topic. You take turns being the interviewer and interviewee using our guided rubric." },
  { question: "Can I switch skills mid-roadmap?", answer: "Absolutely. You can track multiple skills simultaneously or switch tracks whenever you want." },
];

export const FEATURES: Feature[] = [
  {
    icon: Map,
    title: 'Structured Roadmaps',
    description: 'Clear, step-by-step learning paths',
  },
  {
    icon: Zap,
    title: 'Best Free Resources',
    description: 'Curated and verified courses',
  },
  {
    icon: Users,
    title: 'Peer Practice',
    description: 'Learn together with your community',
  }
];

// Mock Data for Kanban (kept as is for project view)
const MEMBERS = [
  { name: 'Alex K.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&q=80' },
  { name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80' },
  { name: 'Mike T.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80' },
  { name: 'Emily W.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80' },
];

export const INITIAL_COLUMNS: Column[] = [
  {
    id: 'Backlog',
    title: 'Backlog',
    tasks: [
      {
        id: '1',
        title: 'Set up database schema',
        status: 'Backlog',
        priority: 'High',
        tags: ['Backend', 'SQL'],
        dueDate: 'Feb 10',
        members: [MEMBERS[0]],
        subtasks: { completed: 0, total: 3 }
      },
      {
        id: '2',
        title: 'Design API endpoints',
        status: 'Backlog',
        priority: 'Medium',
        tags: ['Backend'],
        dueDate: 'Feb 12',
        members: [MEMBERS[1]],
        subtasks: { completed: 1, total: 4 }
      }
    ]
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    tasks: [
      {
        id: '3',
        title: 'Implement user authentication',
        status: 'In Progress',
        priority: 'High',
        tags: ['Backend', 'Security'],
        dueDate: 'Feb 8',
        members: [MEMBERS[2], MEMBERS[0]],
        subtasks: { completed: 2, total: 5 }
      }
    ]
  },
  {
    id: 'Review',
    title: 'Review',
    tasks: [
      {
        id: '4',
        title: 'Create landing page',
        status: 'Review',
        priority: 'Medium',
        tags: ['Frontend'],
        dueDate: 'Feb 6',
        members: [MEMBERS[3]],
        subtasks: { completed: 4, total: 4 }
      }
    ]
  },
  {
    id: 'Done',
    title: 'Done',
    tasks: [
      {
        id: '5',
        title: 'Project setup & dependencies',
        status: 'Done',
        priority: 'Low',
        tags: ['Setup'],
        dueDate: 'Feb 2',
        members: [MEMBERS[0]],
        subtasks: { completed: 2, total: 2 }
      }
    ]
  }
];

// Mock Interview Data
export const INTERVIEW_STATS: InterviewStat[] = [
  { label: 'Practices Completed', value: '3', subtext: '', icon: CheckCircle, color: 'bg-blue-50', iconColor: 'text-primary-600' },
  { label: 'Avg Score', value: '82', subtext: 'Top 15%', icon: Star, color: 'bg-amber-50', iconColor: 'text-amber-600' },
  { label: 'Improvement Trend', value: '+12%', subtext: 'Last 3 sessions', icon: TrendingUp, color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { label: 'Interview Ready', value: '78%', subtext: 'Progress to mastery', icon: Award, color: 'bg-purple-50', iconColor: 'text-purple-600' },
];

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    role: 'Senior SWE',
    company: 'Google',
    specialty: 'DSA & Systems',
    description: 'Senior SWE at Google. Specializes in coding interviews and system design.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 4.9,
    reviews: 127,
    difficulty: 'Medium',
    timezone: 'PST',
    nextAvailable: 'Today, 4:00 PM',
    isMentor: true,
    tags: ['DSA', 'System Design']
  },
  {
    id: 'm2',
    name: 'Alex Kumar',
    role: 'Data Engineer',
    company: 'Netflix',
    specialty: 'SQL & Data',
    description: 'Data Engineer with 5 years experience. Focused on practical SQL scenarios.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    rating: 4.8,
    reviews: 89,
    difficulty: 'Easy',
    timezone: 'EST',
    nextAvailable: 'Tomorrow, 2:00 PM',
    isMentor: true,
    tags: ['SQL', 'Data Modeling']
  },
  {
    id: 'm3',
    name: 'Maria Garcia',
    role: 'Staff Engineer',
    company: 'Uber',
    specialty: 'System Design',
    description: 'Experienced in large-scale distributed systems. Good for L5+ roles.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    rating: 4.7,
    reviews: 156,
    difficulty: 'Hard',
    timezone: 'PST',
    nextAvailable: undefined, // "Availability not published"
    isMentor: true,
    tags: ['System Design', 'Leadership']
  },
  {
    id: 'p1',
    name: 'David Kim',
    role: 'Frontend Dev',
    company: 'Looking for work',
    specialty: 'React & JS',
    description: 'Preparing for frontend interviews. Happy to trade mock sessions.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 4.5,
    reviews: 12,
    difficulty: 'Medium',
    timezone: 'EST',
    nextAvailable: 'Weekends',
    isMentor: false,
    tags: ['Frontend', 'JavaScript']
  }
];

export const MOCK_SESSIONS: InterviewSession[] = [
  { id: 's1', partnerId: 'm1', partnerName: 'Sarah Chen', date: 'Feb 1, 2026', status: 'Completed', score: 85, feedbackNotes: 'Great understanding of joins! Work on edge cases.', type: 'Mentor' },
  { id: 's2', partnerId: 'm2', partnerName: 'Alex Kumar', date: 'Jan 28, 2026', status: 'Completed', score: 78, feedbackNotes: 'Good SQL logic, but query optimization needed.', type: 'Mentor' },
  { id: 's3', partnerId: 'm3', partnerName: 'Maria Garcia', date: 'Jan 25, 2026', status: 'Completed', score: 82, feedbackNotes: 'Solid system design approach.', type: 'Mentor' },
];

export const AI_PRACTICE_PLAN: AITask[] = [
  { id: 'ai1', title: 'Review SQL JOIN patterns', timeEstimate: '30 min', description: 'Focus on INNER vs OUTER joins and performance implications.', outcome: 'Ability to choose correct join type instantly.' },
  { id: 'ai2', title: 'Practice 3 medium-level SQL problems', timeEstimate: '45 min', description: 'Solve LeetCode #175, #176, #180 without looking at solutions.', outcome: 'Improve syntax speed.' },
  { id: 'ai3', title: 'Watch: Common SQL Interview Mistakes', timeEstimate: '15 min', description: 'Video tutorial on avoiding common pitfalls in whiteboard interviews.', outcome: 'Reduce unforced errors.' }
];

// Legacy exports to prevent breaking other files
export const PAST_SESSIONS: PastSession[] = [
  { id: 's1', title: 'SQL Mock Interview', partner: 'Sarah Chen', date: 'Feb 1, 2026', score: 85, feedback: 'Great understanding of joins!' },
  { id: 's2', title: 'Python Mock Interview', partner: 'Alex Kumar', date: 'Jan 28, 2026', score: 78, feedback: 'Work on edge cases' },
  { id: 's3', title: 'DSA Mock Interview', partner: 'Maria Garcia', date: 'Jan 25, 2026', score: 82, feedback: 'Good problem solving approach' },
];

export const PRACTICE_PLAN: PracticeTask[] = [
  { id: 'p1', title: 'Review SQL JOIN patterns', duration: '30 min' },
  { id: 'p2', title: 'Practice 3 medium-level SQL problems', duration: 'Self-paced' },
  { id: 'p3', title: 'Watch: Common SQL Interview Mistakes', duration: '15 min' }
];

// Community Data
export const COMMUNITY_POSTS: Post[] = [
  {
    id: 'p1',
    author: { name: 'Sarah Chen', avatar: 'SC', level: 'Intermediate', matchPercentage: 92 },
    content: "Looking for a study partner to practice SQL joins and aggregations. I'm preparing for data analyst interviews and would love to do mock sessions together. Available weekday evenings PST.",
    tags: ['SQL', 'Study Partner', 'Mock Interview'],
    timestamp: '2 hours ago',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 12,
    likedByMe: false,
    comments: 5,
    timeInfo: 'PST (Your time: PST)'
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
    comments: 8,
    timeInfo: 'EST (Your time: PST)'
  }
];

export const SUGGESTED_PEERS: SuggestedPeer[] = [
  {
    id: 'peer1',
    name: 'David Kim',
    avatar: 'DK',
    matchPercentage: 95,
    role: 'Python',
    level: 'Intermediate',
    availability: 'Weekends',
    location: 'PST',
    peerType: 'Peer'
  },
  {
    id: 'peer2',
    name: 'Emma Wilson',
    avatar: 'EW',
    matchPercentage: 88,
    role: 'SQL',
    level: 'Beginner',
    availability: 'Evenings',
    location: 'EST',
    peerType: 'Peer'
  },
  {
    id: 'peer3',
    name: 'Sarah Chen',
    avatar: 'SC',
    matchPercentage: 98,
    role: 'Fullstack',
    level: 'Expert',
    availability: 'Flexible',
    location: 'PST',
    peerType: 'Mentor'
  },
  {
    id: 'peer4',
    name: 'Raj Patel',
    avatar: 'RP',
    matchPercentage: 92,
    role: 'Python',
    level: 'Intermediate',
    availability: 'Flexible',
    location: 'IST',
    peerType: 'Peer'
  },
  {
    id: 'peer5',
    name: 'Leo Zhang',
    avatar: 'LZ',
    matchPercentage: 85,
    role: 'React',
    level: 'Beginner',
    availability: 'Weekdays',
    location: 'CST',
    peerType: 'Mentee'
  }
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', sender: 'me', text: "Hi! I'm interested in joining your SQL study group.", timestamp: '2:30 PM', read: true },
  { id: 'm2', sender: 'them', text: "Hey! That's great. We meet every Tuesday at 6 PM PST. Are you available then?", timestamp: '2:32 PM', read: true },
  { id: 'm3', sender: 'me', text: "Perfect! I'm at beginner level with SQL. Is that okay?", timestamp: '2:33 PM', read: true }
];
