import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, User } from '../types';

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100'
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'E-commerce Database',
    description: 'Designing and implementing a scalable database for a high-traffic e-commerce platform.',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    visibility: 'Private',
    members: ['u1']
  },
  {
    id: 'p2',
    name: 'Learning Platform',
    description: 'Frontend development for the new student dashboard.',
    startDate: '2026-03-05',
    visibility: 'Public',
    members: ['u1']
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Set up database schema',
    status: 'Backlog',
    priority: 'High',
    tags: ['Backend', 'SQL'],
    assigneeId: 'u1',
    dueDate: 'Feb 10, 2026',
    subtasks: { completed: 0, total: 3 },
    comments: 2,
    attachments: 1,
    members: []
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Implement user authentication',
    status: 'In Progress',
    priority: 'High',
    tags: ['Security', 'Auth'],
    assigneeId: 'u1',
    dueDate: 'Feb 15, 2026',
    subtasks: { completed: 2, total: 5 },
    comments: 5,
    attachments: 0,
    members: []
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Design API Endpoints',
    status: 'Review',
    priority: 'Medium',
    tags: ['API', 'Backend'],
    dueDate: 'Feb 20, 2026',
    subtasks: { completed: 4, total: 4 },
    comments: 0,
    attachments: 2,
    members: []
  }
];

interface ProjectContextType {
  currentUser: User;
  projects: Project[];
  tasks: Task[];
  currentProjectId: string;
  currentProject: Project | undefined;
  setCurrentProjectId: (id: string) => void;
  createProject: (project: Omit<Project, 'id' | 'members'>) => void;
  createTask: (task: Omit<Task, 'id'>) => void;
  getProjectTasks: (projectId: string) => Task[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(MOCK_USER);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [currentProjectId, setCurrentProjectId] = useState<string>(INITIAL_PROJECTS[0].id);

  const currentProject = projects.find(p => p.id === currentProjectId);

  const createProject = (projectData: Omit<Project, 'id' | 'members'>) => {
    const newProject: Project = {
      ...projectData,
      id: `p${Date.now()}`,
      members: [currentUser.id]
    };
    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);
  };

  const createTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t${Date.now()}`
    };
    setTasks([...tasks, newTask]);
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(t => t.projectId === projectId);
  };

  return (
    <ProjectContext.Provider value={{
      currentUser,
      projects,
      tasks,
      currentProjectId,
      currentProject,
      setCurrentProjectId,
      createProject,
      createTask,
      getProjectTasks
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};