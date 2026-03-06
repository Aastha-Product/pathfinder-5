
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, MoreHorizontal, Move, Edit3, Trash2 } from 'lucide-react';
import { Task, Priority } from '../types';

interface ProjectCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onMove?: (task: Task, newStatus: string) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ task, onEdit, onDelete, onMove, onDragStart }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map priority to status dot color
  const getStatusColor = (p: Priority) => {
    switch (p) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] border border-slate-100 hover:shadow-md hover:border-blue-500/30 cursor-grab active:cursor-grabbing group relative flex flex-col transition-all"
    >
      {/* Quick Actions Menu */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
          <button 
             onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
             className={`p-1 text-slate-400 hover:text-blue-600 bg-white/80 rounded hover:bg-white shadow-sm transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
              <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-20">
                  <button 
                    onClick={() => { setShowMenu(false); onEdit?.(task); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                      <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <div className="h-px bg-slate-100"></div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Move To</div>
                  {['Backlog', 'In Progress', 'Review', 'Done'].filter(s => s !== task.status).map(status => (
                      <button 
                        key={status}
                        onClick={() => { setShowMenu(false); onMove?.(task, status); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-blue-600 pl-6 relative"
                      >
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-300"></div>
                         {status}
                      </button>
                  ))}
                  <div className="h-px bg-slate-100"></div>
                  <button 
                    onClick={() => { setShowMenu(false); onDelete?.(task.id); }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                      <Trash2 className="w-3 h-3" /> Delete
                  </button>
              </div>
          )}
      </div>

      {/* Top Row: Tags & Priority */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex flex-wrap gap-1.5">
          {task.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
        <div 
            className={`w-2 h-2 rounded-full ${getStatusColor(task.priority)} ring-2 ring-white`} 
            title={`Priority: ${task.priority}`} 
        />
      </div>

      {/* Title */}
      <h4 className="text-slate-900 font-semibold text-sm leading-snug mb-3 line-clamp-2 pr-6">
        {task.title}
      </h4>

      {/* Footer Row */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        {/* Avatar */}
        <div className="flex items-center gap-2">
          {task.assigneeId ? (
             <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm ring-1 ring-slate-100">
                AJ
             </div>
          ) : (
             <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
               ?
             </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
            {task.dueDate && (
                <div className={`flex items-center ${new Date(task.dueDate) < new Date() ? 'text-red-500' : ''}`}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            )}
            
            {(task.subtasks.total > 0) && (
                 <div className="flex items-center text-slate-500">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    {task.subtasks.completed}/{task.subtasks.total}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
