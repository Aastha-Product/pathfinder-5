import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronRight, Book, Database, Globe, Server, Box, Layout, BarChart, Code, Terminal, Cpu } from 'lucide-react';
import { CURATED_RESOURCES } from '../constants';

const ICONS: Record<string, any> = {
    'Python Developer': Book,
    'SQL Developer': Database,
    'Artificial Intelligence': Globe,
    'System Design Interview Guide': Server,
    'Docker for Beginners': Box,
    'Advanced CSS and Sass': Layout,
    'Data Science for Business': BarChart,
    'Clean Code': Code,
    'JavaScript: The Good Parts': Code,
    'Cracking the Coding Interview': Terminal
};

const COLORS: Record<string, string> = {
    'Python Developer': 'bg-indigo-100 text-indigo-600',
    'SQL Developer': 'bg-orange-100 text-orange-600',
    'Artificial Intelligence': 'bg-cyan-100 text-cyan-600',
    'System Design Interview Guide': 'bg-violet-100 text-violet-600',
    'Docker for Beginners': 'bg-blue-100 text-blue-600',
    'Advanced CSS and Sass': 'bg-pink-100 text-pink-600',
    'Data Science for Business': 'bg-emerald-100 text-emerald-600',
    'Clean Code': 'bg-slate-100 text-slate-600',
    'JavaScript: The Good Parts': 'bg-yellow-100 text-yellow-600',
    'Cracking the Coding Interview': 'bg-green-100 text-green-600'
};

interface ResourcePreviewProps {
  limit?: number;
  onNavigate?: (view: string, slug?: string) => void;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({ limit, onNavigate }) => {
  const displayedResources = limit ? CURATED_RESOURCES.slice(0, limit) : CURATED_RESOURCES;
  const popularSkills = CURATED_RESOURCES.slice(0, 4);

  return (
    <section className="py-20 bg-white" id="resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section 1: Curated Resources */}
            <div className="mb-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-text-900">Curated Resources</h2>
                        <p className="text-text-500 mt-2">Every resource is ranked and tested by our community. Here's why each is recommended.</p>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('resources')}
                        className="hidden sm:flex items-center font-bold text-sm hover:opacity-80 transition-opacity bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent"
                    >
                        View all <ChevronRight className="w-4 h-4 ml-1 text-primary-600" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayedResources.map((resource, i) => {
                        const Icon = ICONS[resource.title] || Book;
                        const colorClass = COLORS[resource.title] || 'bg-slate-100 text-slate-600';
                        
                        return (
                            <motion.div 
                                key={resource.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative h-full"
                            >
                                {/* Gradient Border & Glow Effect */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
                                
                                <div className="relative h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group-hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-slate-100 shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                                            <span className="font-bold text-xs text-slate-700">{resource.rating}</span>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">{resource.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4">{resource.author}</p>

                                    <div className="flex gap-2 mb-5">
                                        <span className="bg-white text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-100 shadow-sm">{resource.duration}</span>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border shadow-sm ${
                                            resource.level === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                            resource.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                                        }`}>
                                            {resource.level}
                                        </span>
                                    </div>

                                    <div className="mb-8 flex-1">
                                        <span className="font-bold text-xs text-slate-900 uppercase tracking-wide opacity-70">Why this: </span>
                                        <span className="text-xs text-slate-500 leading-relaxed block mt-1">{resource.why}</span>
                                    </div>

                                    <button 
                                        onClick={() => onNavigate && onNavigate('resources', resource.slug)}
                                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600"
                                    >
                                        Start learning <ChevronRight className="w-4 h-4 ml-1 opacity-80" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
                
                <div className="mt-8 text-center sm:hidden">
                    <button 
                        onClick={() => onNavigate && onNavigate('resources')}
                        className="text-primary-600 font-semibold text-sm flex items-center justify-center hover:underline"
                    >
                        View all <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Section 2: Popular Skills */}
            <div>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-text-900">Popular Skills</h2>
                        <p className="text-text-500 mt-2">Choose from hundreds of in-demand skills and start your learning journey</p>
                    </div>
                    <button 
                        onClick={() => onNavigate && onNavigate('resources')}
                        className="flex items-center font-bold text-sm hover:opacity-80 transition-opacity bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent"
                    >
                        View all <ChevronRight className="w-4 h-4 ml-1 text-primary-600" />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularSkills.map((skill, i) => {
                            const Icon = ICONS[skill.title] || Book;
                            const colorClass = COLORS[skill.title] || 'bg-indigo-100 text-indigo-600';
                            
                            return (
                            <motion.div 
                                key={skill.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => onNavigate && onNavigate('resources', skill.slug)}
                                className="group relative h-full cursor-pointer"
                            >
                                {/* Gradient Border & Glow Effect */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />

                                <div className="relative h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col group-hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-full shadow-sm">
                                            {(skill.reviews / 1000).toFixed(1)}K learning
                                        </span>
                                    </div>
                                    
                                    <div className="mb-6 flex-1">
                                        <h4 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors">{skill.title}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{skill.why}</p>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center text-sm font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                                            Start Learning <ChevronRight className="w-4 h-4 ml-1 text-primary-600" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                            )
                    })}
                </div>
            </div>

        </div>
    </section>
  );
};