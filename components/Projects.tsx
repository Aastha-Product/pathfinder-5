
import React, { useState } from 'react';
import {
    Plus,
    Search,
    Share2,
    Users,
    ChevronDown,
    Layout,
    List,
    BarChart,
    CheckCircle,
    Folder,
    Calendar as CalendarIcon,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react';
import { Button } from './Button';
import { ProjectCard } from './ProjectCard';
import { InviteModal } from './InviteModal';
import { CreateProjectModal } from './CreateProjectModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { TaskModal } from './TaskModal';
import { Toast } from './Toast';
import { ProjectMembers } from './ProjectMembers';
import { INITIAL_COLUMNS } from '../constants';
import { Column, Task, Project } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProjectsProps {
    onNavigate: (view: 'landing' | 'login' | 'projects' | 'mock-interviews' | 'dashboard' | 'community' | 'resources') => void;
}

const VIEW_MODES = [
    { id: 'board', label: 'Board', icon: Layout },
    { id: 'list', label: 'List', icon: List },
    { id: 'timeline', label: 'Timeline', icon: BarChart },
];

const MOCK_PROJECTS_LIST = [
    { id: '1', name: 'E-commerce Database' },
    { id: '2', name: 'Marketing Campaign Q1' },
    { id: '3', name: 'Mobile App Refactor' },
    { id: '4', name: 'Website Redesign' },
    { id: '5', name: 'Internal Tools' },
    { id: '6', name: 'Customer Portal' },
    { id: '7', name: 'Analytics Dashboard' },
];

export const Projects: React.FC<ProjectsProps> = ({ onNavigate }) => {
    const { user } = useAuth();

    // State
    const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [viewMode, setViewMode] = useState('board');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [timelineMonth, setTimelineMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    // Modals
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTaskStatus, setNewTaskStatus] = useState('Backlog');
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<any | null>(null);

    // UI State
    const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // --- Handlers ---

    React.useEffect(() => {
        loadProjects();
    }, [user]);

    React.useEffect(() => {
        if (currentProject) {
            loadTasks(currentProject.id);
            if (currentProject.startDate) {
                const d = new Date(currentProject.startDate);
                if (!isNaN(d.getTime())) {
                    setTimelineMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                }
            }
        }
    }, [currentProject?.id]);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const fetchedProjects = await api.getProjects();
            setProjects(fetchedProjects);
            if (fetchedProjects.length > 0) {
                setCurrentProject(fetchedProjects[0]);
            } else {
                setCurrentProject(null);
            }
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProjectDates = async (start: string, end: string) => {
        if (!currentProject) return;
        try {
            const updates = { startDate: start, endDate: end };
            await api.updateProject(currentProject.id, updates);
            setCurrentProject({ ...currentProject, ...updates });
            setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, ...updates } : p));
            setToastMessage("Project dates updated");
            setShowToast(true);
        } catch (error) {
            console.error("Failed to update project dates", error);
            setToastMessage("Failed to update project dates");
            setShowToast(true);
        }
    };

    const loadTasks = async (projectId: string) => {
        try {
            const fetchedColumns = await api.getProjectTasks(projectId);
            if (fetchedColumns.length > 0) {
                setColumns(fetchedColumns);
            } else {
                setColumns(INITIAL_COLUMNS);
            }
        } catch (error) {
            console.error("Failed to load tasks", error);
        }
    };

    const syncTasks = async (newColumns: Column[]) => {
        setColumns(newColumns);
        if (currentProject) {
            await api.saveProjectTasks(currentProject.id, newColumns);
        }
    };

    const handleProjectSave = async (data: any) => {
        try {
            if (projectToEdit) {
                // Edit existing
                await api.updateProject(projectToEdit.id, data);
                const updated = { ...projectToEdit, ...data };
                setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                if (currentProject?.id === updated.id) {
                    setCurrentProject(updated);
                }
                setToastMessage("Project updated successfully");
                setProjectToEdit(null);
            } else {
                // Create new
                const created = await api.createProject(data);
                setProjects(prev => [...prev, created]);
                setCurrentProject(created);
                // Initialize columns for new project
                await api.saveProjectTasks(created.id, INITIAL_COLUMNS);
                setColumns(INITIAL_COLUMNS);
                setToastMessage("Project created successfully");
            }
        } catch (error) {
            console.error("Failed to save project", error);
            setToastMessage("Error saving project");
        }
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setIsCreateModalOpen(false);
    };

    const handleProjectDelete = async () => {
        if (projectToDelete) {
            try {
                await api.deleteProject(projectToDelete);
                const newProjects = projects.filter(p => p.id !== projectToDelete);
                setProjects(newProjects);
                if (currentProject?.id === projectToDelete) {
                    setCurrentProject(newProjects.length > 0 ? newProjects[0] : null);
                }
                setToastMessage("Project deleted successfully");
            } catch (error) {
                console.error("Failed to delete project", error);
                setToastMessage("Error deleting project");
            }
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setProjectToDelete(null);
        }
    };

    const handleShare = () => {
        if (!currentProject) return;
        const url = `https://pathfinder.app/projects/${currentProject.id}`;
        navigator.clipboard.writeText(url);
        setToastMessage("Project link copied to clipboard");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleInvite = async (emails: string[]) => {
        if (!currentProject) return;
        await api.inviteToProject(currentProject.id, emails);
        setToastMessage(`Added ${emails.length} new members`);
        setShowToast(true);

        const newMembers = emails.map(email => ({
            user_id: email.toLowerCase(),
            name: email.split('@')[0],
            role: 'Member',
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
        }));

        const updatedProject = { ...currentProject, members: [...currentProject.members, ...newMembers] };
        setCurrentProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

        setTimeout(() => setShowToast(false), 3000);
    };

    const handleTaskSave = (updatedTask: Partial<Task>) => {
        if (editingTask) {
            // Update existing
            const newCols = columns.map(col => ({
                ...col,
                tasks: col.tasks.map(t => t.id === editingTask.id ? { ...t, ...updatedTask } as Task : t)
            }));
            syncTasks(newCols);
            // Handle status change movement
            if (updatedTask.status && updatedTask.status !== editingTask.status) {
                moveTask(editingTask.id, editingTask.status, updatedTask.status);
            }
        } else {
            // Create new
            const newTask: Task = {
                id: Date.now().toString(),
                title: updatedTask.title || 'New Task',
                status: updatedTask.status || newTaskStatus,
                priority: updatedTask.priority || 'Medium',
                tags: updatedTask.tags || [],
                members: [],
                subtasks: { completed: 0, total: 0 },
                ...updatedTask
            } as Task;

            const newCols = columns.map(col =>
                col.id === newTask.status
                    ? { ...col, tasks: [...col.tasks, newTask] }
                    : col
            );
            syncTasks(newCols);
        }
        setIsTaskModalOpen(false);
    };

    const handleTaskDelete = (taskId: string) => {
        const newCols = columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(t => t.id !== taskId)
        }));
        syncTasks(newCols);
    };

    const moveTask = (taskId: string, fromStatus: string, toStatus: string) => {
        let taskToMove: Task | undefined;
        columns.forEach(col => {
            const t = col.tasks.find(x => x.id === taskId);
            if (t) taskToMove = t;
        });

        if (!taskToMove) return;

        const newCols = columns.map(col => {
            if (col.id === fromStatus) {
                return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
            }
            if (col.id === toStatus) {
                return { ...col, tasks: [...col.tasks, { ...taskToMove!, status: toStatus }] };
            }
            return col;
        });
        syncTasks(newCols);
    };

    // --- Drag and Drop Handlers ---
    const onDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
        const sourceCol = columns.find(col => col.tasks.some(t => t.id === taskId));
        if (sourceCol) {
            e.dataTransfer.setData("sourceColId", sourceCol.id);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent, targetColId: string) => {
        const taskId = e.dataTransfer.getData("taskId");
        const sourceColId = e.dataTransfer.getData("sourceColId");

        if (taskId && sourceColId && sourceColId !== targetColId) {
            moveTask(taskId, sourceColId, targetColId);
        }
    };

    // --- Timeline Calculations ---
    const getAllTasksWithDates = () => {
        return columns.flatMap(c => c.tasks).filter(t => t.startDate && t.dueDate);
    };
    const tasksWithDates = getAllTasksWithDates();

    // Helper to determine position on timeline
    const getTimelinePosition = (start: string, end: string) => {
        const [viewYear, viewMonthStr] = timelineMonth.split('-');
        if (!viewYear || !viewMonthStr) return { left: '0%', width: '0%', display: 'none' };
        
        const viewYearNum = parseInt(viewYear);
        const viewMonthNum = parseInt(viewMonthStr) - 1;
        
        const viewStartDate = new Date(viewYearNum, viewMonthNum, 1).getTime();
        const viewEndDate = new Date(viewYearNum, viewMonthNum + 1, 0, 23, 59, 59, 999).getTime();
        const daysInMonth = new Date(viewYearNum, viewMonthNum + 1, 0).getDate();
        
        const taskStart = new Date(start).getTime();
        const taskEnd = new Date(end).getTime() + (23 * 60 * 60 * 1000); // assume end of day
        
        if (taskEnd < viewStartDate || taskStart > viewEndDate) {
            return { left: '0%', width: '0%', display: 'none' };
        }

        const effectiveStart = Math.max(taskStart, viewStartDate);
        const effectiveEnd = Math.min(taskEnd, viewEndDate);

        const msPerDay = 1000 * 60 * 60 * 24;
        const startOffsetDays = (effectiveStart - viewStartDate) / msPerDay;
        const durationDays = (effectiveEnd - effectiveStart) / msPerDay;

        const dayWidth = 100 / daysInMonth;

        return { 
            left: `${startOffsetDays * dayWidth}%`, 
            width: `${Math.max(durationDays * dayWidth, dayWidth)}%`,
            display: 'block'
        };
    };

    if (loading) {
        return (
            <div className="h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-white flex flex-col overflow-hidden">
            {/* Toast */}
            <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

            {/* --- Project Header Area (Fixed) --- */}
            <div className="flex-shrink-0 bg-white pt-6 px-6 lg:px-8 pb-0 z-10 border-b border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">

                {/* Top Row: Title, Metadata */}
                <div className="mb-6">
                    {/* Row 1: Title + Status */}
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-none">
                            {currentProject ? currentProject.name : 'No Projects Found'}
                        </h1>

                        {/* Status Pill */}
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            On Track
                        </span>

                        {/* View All Projects Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProjectsDropdown(!showProjectsDropdown)}
                                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                aria-label="Switch Project"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            {showProjectsDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowProjectsDropdown(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden py-1">
                                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Your Projects</div>
                                        <div className="max-h-60 overflow-y-auto black-scrollbar-dark pr-1">
                                            {projects.map(p => (
                                                <div key={p.id} className="flex items-center justify-between group/item hover:bg-slate-50 rounded-lg pr-2">
                                                    <button
                                                        onClick={() => { setCurrentProject(p); setShowProjectsDropdown(false); }}
                                                        className={`flex-1 text-left px-4 py-3 text-sm font-medium flex items-center gap-3 ${currentProject?.id === p.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}
                                                    >
                                                        <Folder className={`w-4 h-4 ${currentProject?.id === p.id ? 'fill-current' : ''}`} />
                                                        <span className="truncate">{p.name}</span>
                                                    </button>

                                                    <div className="relative group/menu">
                                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>

                                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover/menu:block z-50">
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setProjectToEdit(p); setIsCreateModalOpen(true); setShowProjectsDropdown(false); }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                                >
                                                                    <Edit className="w-3 h-3" /> Edit
                                                                </button>
                                                                <div className="h-px bg-slate-100 my-1"></div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setProjectToDelete(p.id); setShowProjectsDropdown(false); }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="h-24"></div>
                                        </div>
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <button
                                                onClick={() => { setIsCreateModalOpen(true); setShowProjectsDropdown(false); }}
                                                className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Create New
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Members | Date */}
                    <div className="flex items-center gap-4">
                        <ProjectMembers />
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className="flex items-center text-slate-500 text-sm font-medium">
                            <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                            <input 
                                type="date" 
                                className="bg-transparent border-none focus:ring-0 p-0 text-slate-500 font-medium cursor-pointer w-auto min-w-[110px]" 
                                value={currentProject?.startDate || ''}
                                onChange={(e) => handleUpdateProjectDates(e.target.value, currentProject?.endDate || '')}
                                title="Project Start Date"
                            />
                            <span className="mx-1 text-slate-400">-</span>
                            <input 
                                type="date" 
                                className="bg-transparent border-none focus:ring-0 p-0 text-slate-500 font-medium cursor-pointer w-auto min-w-[110px]" 
                                value={currentProject?.endDate || ''}
                                onChange={(e) => handleUpdateProjectDates(currentProject?.startDate || '', e.target.value)}
                                title="Project End Date"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Row: View Toggles (Left) & Actions (Right) */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    {/* Left: Toggles */}
                    <div className="flex gap-8">
                        {VIEW_MODES.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${viewMode === mode.id
                                    ? 'border-slate-900 text-slate-900'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                <mode.icon className="w-4 h-4" />
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {/* Right: Search & Actions */}
                    {viewMode !== 'timeline' && (
                        <div className="flex flex-wrap items-center gap-3 pb-2">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter tasks..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        <Button
                            variant="secondary"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-9 px-4 rounded-full text-xs font-bold border-slate-200 hover:border-slate-300"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> New Project
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleShare}
                            className="h-9 px-4 rounded-full text-xs font-bold border-slate-200 hover:border-slate-300"
                        >
                            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                        </Button>

                        <Button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="h-9 px-4 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                            <Users className="w-3.5 h-3.5 mr-1.5" /> Invite Members
                        </Button>
                    </div>
                    )}
                </div>
            </div>

            {!currentProject ? (
                <main className="flex-1 bg-white overflow-hidden flex flex-col items-center justify-center">
                    <div className="text-center py-12">
                        <Folder className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Yet</h3>
                        <p className="text-slate-500 mb-6">Create your first project to start organizing tasks.</p>
                        <Button
                            variant="primary"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="h-10 px-6 rounded-full text-sm font-bold shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Create Project
                        </Button>
                    </div>
                </main>
            ) : (
                <main className="flex-1 bg-white overflow-hidden flex flex-col">
                    {/* View: Board (Kanban) */}
                    {viewMode === 'board' && (
                        <div className="flex-1 overflow-x-auto overflow-y-hidden black-scrollbar-dark">
                            <div className="h-full p-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-[1000px]">
                                {columns.map(col => (
                                    <div
                                        key={col.id}
                                        className="flex flex-col bg-slate-50 rounded-xl h-full max-h-full border border-slate-100 overflow-hidden"
                                        onDragOver={onDragOver}
                                        onDrop={(e) => onDrop(e, col.id)}
                                    >
                                        {/* Column Header */}
                                        <div className="p-4 flex items-center justify-between flex-shrink-0 border-b border-slate-100/50">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-700 text-sm">{col.title}</h3>
                                                <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{col.tasks.length}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setNewTaskStatus(col.id);
                                                    setEditingTask(undefined);
                                                    setIsTaskModalOpen(true);
                                                }}
                                                className="text-slate-400 hover:text-primary-600 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Tasks Area - VERTICAL SCROLLBAR HERE */}
                                        <div className="flex-1 overflow-y-auto black-scrollbar-dark scroll-smooth">
                                            <div className="p-3 space-y-3 pb-20">
                                                {col.tasks
                                                    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map(task => (
                                                        <ProjectCard
                                                            key={task.id}
                                                            task={task}
                                                            onEdit={(t) => { setEditingTask(t); setIsTaskModalOpen(true); }}
                                                            onMove={(t, status) => moveTask(t.id, t.status, status)}
                                                            onDelete={(id) => handleTaskDelete(id)}
                                                            onDragStart={onDragStart}
                                                        />
                                                    ))}

                                                {/* Quick Add Button at bottom of column */}
                                                <button
                                                    onClick={() => {
                                                        setNewTaskStatus(col.id);
                                                        setEditingTask(undefined);
                                                        setIsTaskModalOpen(true);
                                                    }}
                                                    className="w-full py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-dashed border-slate-300 hover:border-slate-400"
                                                >
                                                    <Plus className="w-4 h-4" /> Add Task
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: List */}
                    {viewMode === 'list' && (
                        <div className="flex-1 overflow-y-auto black-scrollbar-dark p-6 lg:p-8">
                            <div className="max-w-6xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                                    <div className="col-span-5">Task Name</div>
                                    <div className="col-span-3">Status</div>
                                    <div className="col-span-2">Assignee</div>
                                    <div className="col-span-2 text-right">Due Date</div>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {columns.flatMap(c => c.tasks)
                                        .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map(task => (
                                            <div
                                                key={task.id}
                                                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 cursor-pointer transition-colors group"
                                                onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}
                                            >
                                                <div className="col-span-5 flex items-center gap-3">
                                                    <CheckCircle className={`w-4 h-4 ${task.status === 'Done' ? 'text-green-500' : 'text-slate-300'}`} />
                                                    <span className={`font-medium text-sm text-slate-900 truncate ${task.status === 'Done' ? 'line-through text-slate-400' : ''}`}>{task.title}</span>
                                                </div>
                                                <div className="col-span-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${task.status === 'Done' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-2">
                                                    {task.assigneeId ? (
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">AJ</div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">?</div>
                                                    )}
                                                </div>
                                                <div className="col-span-2 text-right text-sm text-slate-500 font-medium">
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: Timeline (Client-side Preview) */}
                    {viewMode === 'timeline' && (
                        <div className="flex-1 overflow-auto black-scrollbar-dark p-6 lg:p-8">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-x-auto min-h-[500px]">
                                <div className="min-w-[800px]">
                                    {/* Timeline Header */}
                                    <div className="flex border-b border-slate-100 pb-4 mb-4 items-center">
                                        <div className="w-1/4 font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center justify-between pr-4">
                                            <span>Task</span>
                                            <input 
                                                type="month" 
                                                className="border border-slate-200 rounded px-2 py-1 text-slate-700 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 h-8" 
                                                value={timelineMonth} 
                                                onChange={e => setTimelineMonth(e.target.value)} 
                                            />
                                        </div>
                                        <div className="w-3/4 flex justify-between px-4">
                                            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(w => (
                                                <div key={w} className="text-xs font-bold text-slate-400 uppercase">{w}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {tasksWithDates.length > 0 ? (
                                        <div className="space-y-6">
                                            {tasksWithDates.map(task => {
                                                const style = getTimelinePosition(task.startDate!, task.dueDate!);
                                                return (
                                                    <div key={task.id} className="flex items-center group cursor-pointer" onClick={() => { setEditingTask(task); setIsTaskModalOpen(true); }}>
                                                        <div className="w-1/4 pr-4">
                                                            <div className="text-sm font-semibold text-slate-900 truncate">{task.title}</div>
                                                            <div className="text-xs text-slate-500">{task.assigneeId ? 'Assigned' : 'Unassigned'}</div>
                                                        </div>
                                                        <div className="w-3/4 relative h-8 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                                                            <div
                                                                className={`absolute top-1 bottom-1 rounded-md opacity-90 transition-all group-hover:opacity-100 ${task.status === 'Done' ? 'bg-green-500' :
                                                                    task.status === 'In Progress' ? 'bg-blue-500' : 'bg-slate-400'
                                                                    }`}
                                                                style={{ left: style.left, width: style.width, display: style.display || 'block' }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                            <h3 className="text-lg font-bold text-slate-900">No timeline data</h3>
                                            <p className="text-slate-500 mb-6">Add start and due dates to your tasks to see them on the timeline.</p>
                                            <Button variant="secondary" onClick={() => { setNewTaskStatus('Backlog'); setEditingTask(undefined); setIsTaskModalOpen(true); }}>
                                                Create Task with Dates
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            )}

            {/* --- Modals --- */}
            <InviteModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInvite}
            />

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setProjectToEdit(null); }}
                initialData={projectToEdit}
                onSave={handleProjectSave}
            />

            <DeleteConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={handleProjectDelete}
                title="Delete Project?"
                message="Are you sure you want to delete this project? This action cannot be undone."
                confirmLabel="Delete"
            />

            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
                task={editingTask}
                initialStatus={newTaskStatus}
            />

            <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};
