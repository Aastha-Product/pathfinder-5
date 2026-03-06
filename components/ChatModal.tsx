
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, Maximize2, MoreHorizontal, MessageCircle, ChevronLeft } from 'lucide-react';
import { CHAT_MESSAGES } from '../constants';
import { Button } from './Button';
import { api } from '../services/api';
import { Conversation } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string; // If empty, show list
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, recipientName: initialRecipient }) => {
  const [currentRecipient, setCurrentRecipient] = useState(initialRecipient);
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  
  // History State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [view, setView] = useState<'list' | 'chat'>(initialRecipient ? 'chat' : 'list');

  useEffect(() => {
      if (initialRecipient) {
          setCurrentRecipient(initialRecipient);
          setView('chat');
      } else {
          setView('list');
          loadConversations();
      }
  }, [initialRecipient, isOpen]);

  const loadConversations = async () => {
      const convs = await api.getConversations();
      setConversations(convs);
  };

  const handleSelectConversation = (name: string) => {
      setCurrentRecipient(name);
      setView('chat');
  };

  const handleBackToList = () => {
      setView('list');
      setCurrentRecipient('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: 1, 
            y: isMinimized ? 'calc(100% - 56px)' : 0,
            height: isMinimized ? '56px' : '520px'
          }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 right-0 md:right-8 z-[110] w-full md:w-[360px] bg-white rounded-t-2xl shadow-[0_-4px_30px_rgba(15,23,42,0.15)] border border-slate-200 flex flex-col overflow-hidden"
      >
         {/* Header */}
         <div 
           className="p-3 bg-gradient-to-r from-blue-600 via-primary-600 to-indigo-600 text-white cursor-pointer flex items-center justify-between relative overflow-hidden group"
           onClick={() => isMinimized && setIsMinimized(false)}
         >
             <div className="flex items-center gap-3 relative z-10">
                 {view === 'chat' && !initialRecipient && (
                     <button onClick={(e) => { e.stopPropagation(); handleBackToList(); }} className="hover:bg-white/20 p-1 rounded-full">
                         <ChevronLeft className="w-5 h-5" />
                     </button>
                 )}
                 
                 {view === 'chat' ? (
                     <>
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white border border-white/30">
                                {currentRecipient?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-primary-600 rounded-full"></span>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm tracking-tight">{currentRecipient}</h4>
                            <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wider">Online</p>
                        </div>
                     </>
                 ) : (
                     <div className="flex items-center gap-2">
                         <MessageCircle className="w-5 h-5" />
                         <h4 className="font-bold text-sm">Messages</h4>
                     </div>
                 )}
             </div>

             <div className="flex items-center gap-1 relative z-10">
                 <button 
                   onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                   className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                 >
                     {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onClose(); }} 
                   className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                 >
                     <X className="w-4 h-4" />
                 </button>
             </div>
         </div>

         {!isMinimized && view === 'list' && (
             <div className="flex-1 overflow-y-auto bg-slate-50">
                 {conversations.length === 0 ? (
                     <div className="p-8 text-center text-slate-400 text-sm">No recent conversations.</div>
                 ) : (
                     <div className="divide-y divide-slate-100 bg-white">
                         {conversations.map(conv => (
                             <div 
                                key={conv.id} 
                                onClick={() => handleSelectConversation(conv.recipientName)}
                                className="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                             >
                                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                                     {conv.recipientAvatar}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                     <div className="flex justify-between items-baseline mb-0.5">
                                         <h5 className="font-bold text-sm text-slate-900 truncate">{conv.recipientName}</h5>
                                         <span className="text-[10px] text-slate-400">{conv.timestamp}</span>
                                     </div>
                                     <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                                 </div>
                                 {conv.unreadCount > 0 && (
                                     <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                                         {conv.unreadCount}
                                     </span>
                                 )}
                             </div>
                         ))}
                     </div>
                 )}
             </div>
         )}

         {!isMinimized && view === 'chat' && (
           <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
                {CHAT_MESSAGES.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm transition-all
                          ${msg.sender === 'me' 
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}
                        >
                           <p className="font-medium">{msg.text}</p>
                           <div className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 font-bold ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                               {msg.timestamp}
                               {msg.sender === 'me' && msg.read && <span className="text-blue-200">✓✓</span>}
                           </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-end gap-2">
                    <div className="flex-1 relative">
                        <textarea 
                          rows={1}
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          className="w-full bg-slate-100 border-none rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all resize-none max-h-32"
                          placeholder="Write a message..."
                          style={{ minHeight: '44px' }}
                        />
                        <div className="absolute right-2 bottom-2 flex gap-1">
                             <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                                 <MoreHorizontal className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-11 h-11 px-0 rounded-2xl flex items-center justify-center shrink-0" 
                      disabled={!message.trim()}
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </Button>
                </div>
            </div>
           </>
         )}
      </motion.div>
    </AnimatePresence>
  );
};
