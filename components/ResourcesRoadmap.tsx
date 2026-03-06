import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle, Lock, ExternalLink, ChevronDown, ChevronUp, BookOpen, Award, ArrowRight, Zap, Clock, Search, List, CheckSquare, Square, Star,
    Database, FlaskConical, BarChart3, Bot, Brain, Layers, Code, Cloud, Shield, TrendingUp, ClipboardList
} from 'lucide-react';
import { api } from '../services/api';
import { CatalogData, CourseData, UserCourseProgressState, ResourceItem, UserModuleProgress, UserProjectProgress } from '../types';
import { resourcesData } from '../src/data/resources';

interface ResourcesRoadmapProps {
    onNavigate?: (view: string) => void;
    initialSearchTerm?: string;
    initialCourseSlug?: string;
}

type ViewMode = 'catalog' | 'course';

const getCourseTheme = (slug: string) => {
    switch (slug) {
        case 'sql-developer': return { icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' };
        case 'data-science': return { icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-50' };
        case 'data-analytics': return { icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' };
        case 'machine-learning-engineer': return { icon: Bot, color: 'text-emerald-600', bg: 'bg-emerald-50' };
        case 'artificial-intelligence': return { icon: Brain, color: 'text-rose-600', bg: 'bg-rose-50' };
        case 'full-stack-developer': return { icon: Layers, color: 'text-cyan-600', bg: 'bg-cyan-50' };
        case 'python-developer': return { icon: Code, color: 'text-yellow-600', bg: 'bg-yellow-50' };
        case 'cloud-computing': return { icon: Cloud, color: 'text-sky-600', bg: 'bg-sky-50' };
        case 'cybersecurity': return { icon: Shield, color: 'text-red-600', bg: 'bg-red-50' };
        case 'business-analytics': return { icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' };
        case 'product-management': return { icon: ClipboardList, color: 'text-teal-600', bg: 'bg-teal-50' };
        default: return { icon: BookOpen, color: 'text-primary-600', bg: 'bg-primary-50' };
    }
};

export const ResourcesRoadmap: React.FC<ResourcesRoadmapProps> = ({ onNavigate, initialSearchTerm = '', initialCourseSlug }) => {
    const [viewMode, setViewMode] = useState<ViewMode>(initialCourseSlug ? 'course' : 'catalog');
    const [catalog, setCatalog] = useState<CatalogData | null>(null);
    const [activeCourseSlug, setActiveCourseSlug] = useState<string | null>(initialCourseSlug || null);
    const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
    const [courseProgress, setCourseProgress] = useState<UserCourseProgressState | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);

    useEffect(() => {
        loadCatalog();
    }, []);

    useEffect(() => {
        if (activeCourseSlug) {
            loadCourse(activeCourseSlug);
        }
    }, [activeCourseSlug]);

    const loadCatalog = async () => {
        setLoading(true);
        try {
            const data = await api.getCatalog();
            setCatalog(data);
        } catch (error) {
            console.error("Failed to load catalog", error);
        } finally {
            setLoading(false);
        }
    };

    const loadCourse = async (slug: string) => {
        setLoading(true);
        try {
            const [course, progress] = await Promise.all([
                api.getCourse(slug),
                api.getCourseProgress(slug)
            ]);
            if (course) setActiveCourse(course);
            setCourseProgress(progress);
            setViewMode('course');
            
            // Auto-expand the first in-progress or first locked module
            if (progress && course?.modules) {
                const firstInProgress = course.modules.find(m => progress.modules[m.order]?.status === 'in_progress');
                if (firstInProgress) {
                    setExpandedModules([firstInProgress.order]);
                } else {
                    setExpandedModules([1]);
                }
            }
        } catch (error) {
            console.error("Failed to load course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleModuleToggle = (moduleOrder: number) => {
        setExpandedModules(prev => 
            prev.includes(moduleOrder) ? prev.filter(order => order !== moduleOrder) : [...prev, moduleOrder]
        );
    };

    const handleResourceClick = async (resource: ResourceItem, moduleId: number) => {
        if (resource.url.startsWith('internal:')) {
            const view = resource.url.split(':')[1];
            if (onNavigate) {
                onNavigate(view);
            }
            return;
        }
        window.open(resource.url, '_blank');
        await api.logRoadmapEvent('resource_click', moduleId);
    };

    const handleMarkModuleComplete = async (moduleOrder: number) => {
        if (!activeCourseSlug) return;
        try {
            const updatedProgress = await api.markModuleComplete(activeCourseSlug, moduleOrder);
            setCourseProgress(updatedProgress);
            await api.logRoadmapEvent('module_complete', moduleOrder);
        } catch (error) {
            console.error("Failed to mark module complete", error);
        }
    };

    const handleMarkProjectComplete = async (projectTitle: string) => {
        if (!activeCourseSlug) return;
        try {
            const updatedProgress = await api.markProjectComplete(activeCourseSlug, projectTitle);
            setCourseProgress(updatedProgress);
        } catch (error) {
            console.error("Failed to mark project complete", error);
        }
    };

    const filteredCourses = catalog?.courses.filter(c => 
        (c.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (c.shortDesc?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (c.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const isProjectsUnlocked = () => {
        if (!activeCourse || !courseProgress) return false;
        // Check if all non-optional modules are completed
        const requiredModules = activeCourse.modules?.filter(m => !m.isOptional) || [];
        return requiredModules.every(m => courseProgress.modules[m.order]?.status === 'completed');
    };

    const isMockInterviewUnlocked = () => {
        if (!courseProgress) return false;
        // Check if at least one project is completed
        return (Object.values(courseProgress.projects) as UserProjectProgress[]).some(p => p.isCompleted);
    };

    if (loading && !catalog) {
        return (
            <div className="min-h-screen bg-slate-50 pt-24 pb-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-16 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {viewMode === 'catalog' ? (
                    <div className="space-y-12">
                        {/* Catalog Header - Image 2 Style */}
                        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="relative z-10 max-w-3xl">
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Learning Resources</h1>
                                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                                    Curated collection of the best free courses, tutorials, and learning materials for your skill development.
                                </p>
                                
                                <div className="relative max-w-2xl">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Search resources by title or keyword..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none shadow-sm text-slate-900 placeholder-slate-400 transition-all"
                                    />
                                </div>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                        </div>

                        {/* Course Grid - Image 3 Style */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCourses.map(course => {
                                const theme = getCourseTheme(course.slug);
                                const CourseIcon = theme.icon;
                                return (
                                <div key={course.slug} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group gradient-ring fade-up">
                                    {/* Image Placeholder Area */}
                                    <div className={`h-48 ${theme.bg} relative flex items-center justify-center overflow-hidden`}>
                                        {/* Placeholder Pattern */}
                                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:16px_16px] text-slate-900"></div>
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center z-10">
                                            <CourseIcon className={`w-8 h-8 ${theme.color}`} />
                                        </div>
                                        
                                        {/* Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full shadow-sm">
                                                Course
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                                        <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">{course.shortDesc}</p>
                                        
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.modules?.reduce((acc, m) => acc + m.estimatedMinutes, 0) ? Math.round(course.modules.reduce((acc, m) => acc + m.estimatedMinutes, 0) / 60) + ' hours' : 'Self-paced'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                                <span className="font-medium text-slate-700">4.8</span>
                                                <span className="text-slate-400">(120)</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar Placeholder (Visual only as per Image 3) */}
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
                                            <div className="bg-primary-500 h-full rounded-full w-1/3"></div>
                                        </div>

                                        <div className="mt-auto">
                                            {course.isMvpCardOnly ? (
                                                <button 
                                                    disabled
                                                    className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed text-sm"
                                                >
                                                    Coming Soon
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => setActiveCourseSlug(course.slug)}
                                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-primary-600/20 text-sm"
                                                >
                                                    Start Learning
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>

                        {/* Curated Resources Section - Image 3 Style */}
                        <div className="pt-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Recommended Resources</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {resourcesData.map(resource => (
                                    <div key={resource.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group gradient-ring fade-up">
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{resource.title}</h3>
                                            
                                            <p className="text-sm text-slate-500 mb-6 mt-auto font-medium">
                                                {resource.subtitle}
                                            </p>

                                            <a 
                                                href={resource.cta_href}
                                                target={resource.open_new_tab ? "_blank" : undefined}
                                                rel={resource.open_new_tab ? "noopener noreferrer" : undefined}
                                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-primary-600/20 text-sm text-center block mt-auto"
                                                role="button"
                                                aria-label={`${resource.cta_text} — ${resource.title}${resource.open_new_tab ? ' (opens in new tab)' : ''}`}
                                                data-track="resource_open"
                                                data-resource-id={resource.id}
                                            >
                                                {resource.cta_text}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    activeCourse && (
                        <div className="space-y-8">
                            {/* Course Header */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <button 
                                    onClick={() => {
                                        setViewMode('catalog');
                                        setActiveCourseSlug(null);
                                        setActiveCourse(null);
                                    }}
                                    className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm mb-6"
                                >
                                    <div className="p-1 bg-slate-100 rounded-md group-hover:bg-slate-200 transition-colors">
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                    </div>
                                    Back to Catalog
                                </button>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{activeCourse.title}</h1>
                                        <p className="text-slate-500">{activeCourse.shortDesc}</p>
                                    </div>
                                    
                                    {/* Progress Card */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-[200px]">
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Course Progress</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-2xl font-bold text-primary-600">
                                                {Math.round(((Object.values(courseProgress?.modules || {}) as UserModuleProgress[]).filter(m => m.status === 'completed').length / (activeCourse.modules?.length || 1)) * 100)}%
                                            </span>
                                            <span className="text-sm text-slate-400 mb-1">completed</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                            <div 
                                                className="bg-primary-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${Math.round(((Object.values(courseProgress?.modules || {}) as UserModuleProgress[]).filter(m => m.status === 'completed').length / (activeCourse.modules?.length || 1)) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {isProjectsUnlocked() && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between shadow-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                                <Award className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Capstone Projects Unlocked!</h3>
                                                <p className="text-indigo-100 text-sm">You're ready to build your portfolio.</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const element = document.getElementById('projects-section');
                                                element?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            View Projects <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Modules List */}
                                <div className="lg:col-span-8 space-y-4">
                                    {activeCourse.modules?.map((module, index) => {
                                        const isExpanded = expandedModules.includes(module.order);
                                        const moduleStatus = courseProgress?.modules[module.order]?.status || 'locked';
                                        const isLocked = moduleStatus === 'locked';
                                        const isCompleted = moduleStatus === 'completed';

                                        return (
                                            <div key={module.order} className={`bg-white rounded-xl border transition-all duration-200 ${isCompleted ? 'border-green-200 shadow-sm' : isLocked ? 'border-slate-100 bg-slate-50 opacity-75' : 'border-primary-100 shadow-md ring-1 ring-primary-50'}`}>
                                                <button 
                                                    onClick={() => !isLocked && handleModuleToggle(module.order)}
                                                    disabled={isLocked}
                                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? 'bg-green-100 text-green-600' : isLocked ? 'bg-slate-200 text-slate-400' : 'bg-primary-100 text-primary-600'}`}>
                                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : module.order}
                                                        </div>
                                                        <div>
                                                            <h3 className={`font-bold ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{module.title}</h3>
                                                            <p className="text-sm text-slate-500">{module.estimatedMinutes} min • {module.subtopics.length} topics</p>
                                                        </div>
                                                    </div>
                                                    {!isLocked && (
                                                        <div className="flex items-center gap-4">
                                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                                        </div>
                                                    )}
                                                </button>

                                                <AnimatePresence>
                                                    {isExpanded && !isLocked && (
                                                        <motion.div 
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-5 pt-0 space-y-6">
                                                                <div className="h-px bg-slate-100"></div>
                                                                
                                                                {/* Outcome */}
                                                                <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                                                                    Goal: {module.outcome}
                                                                </div>

                                                                {/* Subtopics */}
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Topics Covered</h4>
                                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                        {module.subtopics.map((topic, i) => (
                                                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></div>
                                                                                {topic}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {/* Resources */}
                                                                <div>
                                                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Learning Resources</h4>
                                                                    <div className="space-y-2">
                                                                        {module.resources.map((resource, i) => (
                                                                            <a 
                                                                                key={i}
                                                                                href={resource.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                onClick={() => handleResourceClick(resource, module.order)}
                                                                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="p-2 bg-white rounded-md border border-slate-100 text-primary-600">
                                                                                        <BookOpen className="w-4 h-4" />
                                                                                    </div>
                                                                                    <span className="font-medium text-slate-700 group-hover:text-primary-700">{resource.label}</span>
                                                                                </div>
                                                                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Tests */}
                                                                {module.tests && module.tests.length > 0 && (
                                                                    <div>
                                                                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Practice & Tests</h4>
                                                                        <div className="space-y-2">
                                                                            {module.tests.map((test, i) => (
                                                                                <a 
                                                                                    key={i}
                                                                                    href={test.url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
                                                                                >
                                                                                    <div className="flex items-center gap-3">
                                                                                        <div className="p-2 bg-white rounded-md border border-slate-100 text-amber-600">
                                                                                            <Zap className="w-4 h-4" />
                                                                                        </div>
                                                                                        <span className="font-medium text-slate-700 group-hover:text-amber-800">{test.label}</span>
                                                                                    </div>
                                                                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Complete Button */}
                                                                <div className="pt-4 flex justify-end">
                                                                    <button
                                                                        onClick={() => handleMarkModuleComplete(module.order)}
                                                                        disabled={isCompleted}
                                                                        className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                                                                            isCompleted 
                                                                            ? 'bg-green-100 text-green-700 cursor-default' 
                                                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                                                        }`}
                                                                    >
                                                                        {isCompleted ? (
                                                                            <>
                                                                                <CheckCircle className="w-4 h-4" /> Completed
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                Mark as Complete <ArrowRight className="w-4 h-4" />
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Sidebar */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Projects Section (Locked/Unlocked) */}
                                    <div id="projects-section" className={`rounded-xl border p-5 ${isProjectsUnlocked() ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                            {isProjectsUnlocked() ? <Award className="w-5 h-5 text-indigo-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                                            Capstone Projects
                                        </h3>
                                        
                                        {!isProjectsUnlocked() ? (
                                            <p className="text-sm text-slate-500">
                                                Complete all required modules to unlock the capstone projects and build your portfolio.
                                            </p>
                                        ) : (
                                            <div className="space-y-4">
                                                <button 
                                                    onClick={() => onNavigate?.('projects')}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mb-2"
                                                >
                                                    Start Project <ArrowRight className="w-4 h-4" />
                                                </button>

                                                <p className="text-sm text-slate-500 mb-4">
                                                    Build these to prove your skills. Mark them as complete when you're done.
                                                </p>
                                                {activeCourse.projects?.map((project, i) => {
                                                    const isProjectCompleted = courseProgress?.projects[project.title]?.isCompleted;
                                                    
                                                    return (
                                                        <div key={i} className="border border-slate-100 rounded-lg p-3 bg-slate-50 hover:bg-white transition-colors">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-semibold text-slate-800 text-sm">{project.title}</h4>
                                                                <button 
                                                                    onClick={() => handleMarkProjectComplete(project.title)}
                                                                    className={`text-xs p-1 rounded ${isProjectCompleted ? 'text-green-600 bg-green-100' : 'text-slate-400 hover:text-indigo-600'}`}
                                                                >
                                                                    {isProjectCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mb-2">{project.problem}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {project.tools.map(tool => (
                                                                    <span key={tool} className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                                                                        {tool}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Mock Interview CTA */}
                                    <div className={`rounded-xl p-5 border ${isMockInterviewUnlocked() ? 'bg-gradient-to-br from-primary-600 to-indigo-700 text-white border-transparent shadow-lg' : 'bg-slate-50 border-slate-200'}`}>
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            {isMockInterviewUnlocked() ? <Zap className="w-5 h-5 text-yellow-300" /> : <Lock className="w-4 h-4 text-slate-400" />}
                                            Mock Interview
                                        </h3>
                                        <p className={`text-sm mb-4 ${isMockInterviewUnlocked() ? 'text-primary-100' : 'text-slate-500'}`}>
                                            {isMockInterviewUnlocked() 
                                                ? "You're ready! Start a peer mock interview to practice your storytelling." 
                                                : "Complete at least one capstone project to unlock mock interviews."}
                                        </p>
                                        <button 
                                            disabled={!isMockInterviewUnlocked()}
                                            onClick={() => onNavigate?.('mock-interviews')}
                                            className={`w-full py-2.5 rounded-lg font-bold text-sm transition-colors ${
                                                isMockInterviewUnlocked() 
                                                ? 'bg-white text-primary-700 hover:bg-primary-50' 
                                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Start Mock Interview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
