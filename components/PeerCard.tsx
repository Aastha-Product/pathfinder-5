import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, MessageSquare } from 'lucide-react';
import { SuggestedPeer } from '../types';
import { Button } from './Button';

interface PeerCardProps {
  peer: SuggestedPeer;
  onDm?: (name: string) => void;
}

export const PeerCard: React.FC<PeerCardProps> = ({ peer, onDm }) => {
  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'Mentor': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Mentee': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(15,23,42,0.08)" }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft transition-all h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner
              ${peer.peerType === 'Mentor' ? 'bg-indigo-500' : peer.peerType === 'Mentee' ? 'bg-amber-500' : 'bg-emerald-500'}`}
            >
              {peer.avatar}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h4 className="font-bold text-black text-sm">{peer.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTypeStyles(peer.peerType)}`}>
                  {peer.peerType}
               </span>
               <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  {peer.matchPercentage}% Match
               </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
           <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
           <span className="text-black font-bold">{peer.role}</span>
           <span>•</span>
           <span>{peer.level}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
           <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="truncate">{peer.location}</span>
           </div>
           <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="truncate">{peer.availability}</span>
           </div>
        </div>
      </div>

      <Button 
        variant="primary" 
        size="sm" 
        className="w-full text-xs h-9"
        onClick={() => onDm?.(peer.name)}
      >
        <MessageSquare className="w-3.5 h-3.5 mr-2" /> Send DM
      </Button>
    </motion.div>
  );
};