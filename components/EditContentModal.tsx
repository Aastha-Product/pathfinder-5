
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from './Button';

interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, tags?: string[]) => void;
  initialContent: string;
  initialTags?: string[];
  type: 'post' | 'comment';
}

export const EditContentModal: React.FC<EditContentModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialContent, 
  initialTags = [], 
  type 
}) => {
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setTags(initialTags);
    }
  }, [isOpen, initialContent, initialTags]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      onSave(content, tags);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (['Enter', ','].includes(e.key) && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">
              Edit {type === 'post' ? 'Post' : 'Comment'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1.5">Content</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-sm resize-none text-slate-700 placeholder-slate-400"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={type === 'post' ? 5000 : 1000}
              />
              <div className="text-right text-xs text-slate-400 mt-1">
                {content.length} / {type === 'post' ? 5000 : 1000}
              </div>
            </div>

            {type === 'post' && (
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1.5">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <motion.span 
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={tag} 
                      className="pf-tag pr-2"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="ml-1.5 text-slate-400 hover:text-red-500 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 text-sm text-slate-700 placeholder-slate-400 transition-all"
                  placeholder="Add tags (press Enter)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!content.trim() || isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
