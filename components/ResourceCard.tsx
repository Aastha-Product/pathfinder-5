
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Image as ImageIcon, Check, ExternalLink, Plus } from 'lucide-react';
import { Resource } from '../types';
import { Button } from './Button';

interface ResourceCardProps {
  resource: Resource;
  onAdd: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onAdd }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    setIsAdded(!isAdded);
    onAdd(resource.id);
  };

  const handleOpen = () => {
      // Mock tracking call then open link
      console.log(`Tracking click for resource ${resource.id}`);
      window.open(resource.link || '#', '_blank');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Intermediate': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Advanced': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-all group relative cursor-pointer"
      onClick={handleOpen}
    >
      {/* Top Banner / Image */}
      <div className="h-40 bg-slate-100 relative flex items-center justify-center overflow-hidden">
          {resource.image ? (
              <img src={resource.image} alt={resource.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
              <div className="w-16 h-16 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
              </div>
          )}
          
          <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm ${getLevelColor(resource.level)}`}>
              {resource.level}
          </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
          {resource.provider && (
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {resource.provider}
              </div>
          )}
          
          <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
              {resource.title}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
              {resource.why}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-4">
                  <div className="flex items-center gap-3">
                      <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {resource.duration}
                      </div>
                      <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 mr-1 text-amber-400 fill-current" />
                          <span className="text-slate-900">{resource.rating}</span>
                          <span className="text-slate-400 ml-0.5">({resource.reviews})</span>
                      </div>
                  </div>
              </div>

              <div className="flex gap-2">
                  <Button 
                    className="flex-1 h-9 text-xs font-bold"
                    onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                  >
                      Open
                  </Button>
                  <Button 
                    variant={isAdded ? "secondary" : "outline"} 
                    className={`h-9 px-3 text-xs font-bold ${isAdded ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'border-slate-200'}`}
                    onClick={handleAdd}
                  >
                      {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
              </div>
          </div>
      </div>
    </motion.div>
  );
};

export const ResourceSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full">
      <div className="h-40 bg-slate-100 animate-pulse"></div>
      <div className="p-5 space-y-3">
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse"></div>
          <div className="h-16 w-full bg-slate-50 rounded animate-pulse"></div>
          <div className="flex justify-between pt-2">
               <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
               <div className="h-3 w-16 bg-slate-100 rounded animate-pulse"></div>
          </div>
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse mt-2"></div>
      </div>
  </div>
);
