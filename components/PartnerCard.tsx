
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { InterviewPartner } from '../types';
import { Button } from './Button';

interface PartnerCardProps {
  partner: InterviewPartner;
  onInvite: (partner: InterviewPartner) => void;
  onClick?: (partner: InterviewPartner) => void;
  onProfileClick?: (partner: InterviewPartner) => void;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onInvite, onClick, onProfileClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all flex flex-col h-full hover:border-blue-200 cursor-pointer"
      onClick={() => onClick && onClick(partner)}
    >
      <div className="flex items-start gap-4 mb-4">
          <img 
            src={partner.avatar_url} 
            alt={partner.name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              if (onProfileClick) {
                e.stopPropagation();
                onProfileClick(partner);
              }
            }}
          />
          <div>
              <h3 
                className="text-lg font-bold text-slate-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  if (onProfileClick) {
                    e.stopPropagation();
                    onProfileClick(partner);
                  }
                }}
              >
                {partner.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-200">
                      {partner.role}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      {partner.rating}
                  </div>
              </div>
          </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed min-h-[2.5em]">
          {partner.short_bio}
      </p>

      <div className="mb-6 flex-grow space-y-4">
          <div>
              <div className="flex flex-wrap gap-2">
                  {partner.skills.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                          {tag}
                      </span>
                  ))}
              </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-medium pt-2 border-t border-slate-50">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-500">
                  Available: <span className="font-semibold text-slate-900">{partner.next_available || 'Ask in invite'}</span>
              </span>
          </div>
      </div>

      <Button 
          className="w-full text-sm font-bold shadow-md shadow-primary-600/10"
          onClick={(e) => { e.stopPropagation(); onInvite(partner); }}
      >
          Invite to Interview
      </Button>
    </motion.div>
  );
};
