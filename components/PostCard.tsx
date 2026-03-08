
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Send, MoreHorizontal, Trash2, Edit2, X, Check } from 'lucide-react';
import { Post, Comment } from '../types';
import { Button } from './Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
    post: Post;
    onDm: (author: string) => void;
    onPostDeleted?: (postId: string) => void; // Parent callback to remove from feed
}

export const PostCard: React.FC<PostCardProps> = ({ post: initialPost, onDm, onPostDeleted }) => {
    const [post, setPost] = useState(initialPost);
    const [isLiked, setIsLiked] = useState(initialPost.likedByMe);
    const [likeCount, setLikeCount] = useState(initialPost.likes);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    // Comments state
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Edit/Delete State
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editPostContent, setEditPostContent] = useState(post.content);
    const [showPostMenu, setShowPostMenu] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentText, setEditCommentText] = useState('');

    const { user } = useAuth();
    const isMyPost = post.authorId === user?.uid || post.author.name === 'You' || (user?.displayName && post.author.name === user.displayName);
    const isMyComment = (comment: Comment) => comment.authorId === user?.uid || comment.author.name === 'You' || (user?.displayName && comment.author.name === user.displayName);

    // --- Post Actions ---
    const handleLike = async () => {
        const prevLiked = isLiked;
        const prevCount = likeCount;
        setIsLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
        setIsLikeAnimating(true);
        try {
            const result = await api.toggleLike(post.id);
            setIsLiked(result.likedByMe);
            setLikeCount(result.likes);
        } catch (err) {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
        } finally {
            setTimeout(() => setIsLikeAnimating(false), 300);
        }
    };

    const handleEditPost = async () => {
        if (!editPostContent.trim()) return;
        try {
            const updated = await api.updatePost(post.id, editPostContent);
            setPost(prev => ({ ...prev, content: updated.content, updatedAt: updated.updatedAt }));
            setIsEditingPost(false);
        } catch (e) {
            console.error("Failed to update post", e);
        }
    };

    const handleDeletePost = async () => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await api.deletePost(post.id);
                onPostDeleted?.(post.id);
            } catch (e) {
                console.error("Failed to delete post", e);
            }
        }
    };

    // --- Comment Actions ---
    const toggleComments = async () => {
        const willShow = !showComments;
        setShowComments(willShow);
        if (willShow && comments.length === 0 && post.comments > 0) {
            setCommentsLoading(true);
            try {
                const fetched = await api.getComments(post.id);
                setComments(fetched);
            } catch (e) { console.error(e); }
            finally { setCommentsLoading(false); }
        }
    };

    const submitComment = async () => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const newComment = await api.createComment(post.id, commentText);
            setComments([...comments, newComment]);
            setCommentText('');
            setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
        } catch (e) { console.error("Failed to comment", e); }
        finally { setSubmittingComment(false); }
    };

    const startEditComment = (comment: Comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.text);
    };

    const saveEditComment = async (commentId: string) => {
        try {
            const updated = await api.updateComment(post.id, commentId, editCommentText);
            setComments(comments.map(c => c.id === commentId ? updated : c));
            setEditingCommentId(null);
        } catch (e) { console.error("Failed update comment", e); }
    };

    const deleteComment = async (commentId: string) => {
        if (!confirm("Delete comment?")) return;
        try {
            await api.deleteComment(post.id, commentId);
            setComments(comments.filter(c => c.id !== commentId));
            setPost(prev => ({ ...prev, comments: Math.max(0, prev.comments - 1) }));
        } catch (e) { console.error("Failed delete comment", e); }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className="relative mb-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
            {/* Background Gradient Wrapper (Clipped) */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[20%] w-[220%] h-[120%] bg-gradient-to-br from-blue-400 to-indigo-600 opacity-[0.06] blur-xl -rotate-12"></div>
            </div>

            {/* Content Wrapper (Visible Overflow) */}
            <div className="relative z-10 p-5">
                {/* Post Actions Menu (Edit/Delete) */}
                {isMyPost && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="relative">
                            <button onClick={() => setShowPostMenu(!showPostMenu)} className="p-1 text-[#6b7280] hover:text-[#0f172a] rounded hover:bg-slate-100 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {showPostMenu && (
                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-30">
                                    <button onClick={() => { setIsEditingPost(true); setShowPostMenu(false); }} className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={handleDeletePost} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm
            ${isMyPost ? 'bg-primary-600' : post.author.name === 'Sarah Chen' ? 'bg-indigo-500' : 'bg-blue-500'}`}
                        >
                            {post.author.avatar}
                        </div>
                        <div>
                            <div className="flex items-center flex-wrap gap-2">
                                <h3 className="font-bold text-[#0f172a]">{isMyPost ? 'You' : post.author.name}</h3>
                                {post.author.level && (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#6b7280] text-[11px] font-medium border border-slate-200">
                                        {post.author.level}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#6b7280] mt-0.5 font-medium">
                                <span>{post.timestamp}</span>
                                {post.updatedAt && <span>(edited)</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="mb-5">
                    {isEditingPost ? (
                        <div className="space-y-2">
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-[#0f172a] focus:outline-none focus:border-primary-600 focus:bg-white transition-colors"
                                rows={3}
                                value={editPostContent}
                                onChange={e => setEditPostContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditingPost(false)} className="px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded">Cancel</button>
                                <button onClick={handleEditPost} className="px-3 py-1 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded">Save</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[#6b7280] leading-relaxed text-base whitespace-pre-wrap">
                            {post.content}
                        </p>
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && !isEditingPost && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, i) => (
                            <span key={i} className="pf-tag">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                    <div className="flex items-center gap-5 text-[#6b7280] text-sm">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                            <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-current' : ''} ${isLikeAnimating ? 'scale-125' : 'scale-100'}`} />
                            <span className="font-medium">{likeCount}</span>
                        </button>

                        <button
                            onClick={toggleComments}
                            className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-primary-600' : 'hover:text-primary-600'}`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{post.comments} comments</span>
                        </button>
                    </div>

                    {!isMyPost && (
                        <Button size="sm" className="h-8 text-xs px-3" onClick={() => onDm(post.author.name)}>
                            Send DM
                        </Button>
                    )}
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-2 space-y-4">
                                {/* Comment Input */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        You
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                                            placeholder="Write a comment..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:bg-white transition-all pr-10 text-slate-900"
                                        />
                                        <button
                                            onClick={submitComment}
                                            disabled={!commentText.trim() || submittingComment}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 disabled:opacity-30 hover:bg-primary-50 p-1 rounded-md transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-4 pl-11">
                                    {commentsLoading ? (
                                        <div className="text-xs text-slate-400 py-2">Loading comments...</div>
                                    ) : comments.length > 0 ? (
                                        comments.map(comment => (
                                            <div key={comment.id} className="group relative">
                                                <div className="bg-slate-50 p-3 rounded-r-xl rounded-bl-xl text-sm border border-slate-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-[#0f172a] text-xs">{isMyComment(comment) ? 'You' : comment.author.name}</span>

                                                        {/* Actions & Timestamp grouped to prevent overlap */}
                                                        <div className="flex items-center gap-2">
                                                            {/* Comment Actions (Edit/Delete) - only for own comments */}
                                                            {isMyComment(comment) && !editingCommentId && (
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                                    <button onClick={() => startEditComment(comment)} className="p-1 text-slate-400 hover:text-blue-600 bg-white rounded-full shadow-sm" title="Edit"><Edit2 className="w-3 h-3" /></button>
                                                                    <button onClick={() => deleteComment(comment.id)} className="p-1 text-slate-400 hover:text-red-600 bg-white rounded-full shadow-sm" title="Delete"><Trash2 className="w-3 h-3" /></button>
                                                                </div>
                                                            )}
                                                            <span className="text-[10px] text-[#6b7280] whitespace-nowrap">just now</span>
                                                        </div>
                                                    </div>

                                                    {editingCommentId === comment.id ? (
                                                        <div className="mt-1">
                                                            <input
                                                                className="w-full p-2 text-sm border border-slate-200 rounded bg-white text-slate-900 focus:outline-none focus:border-primary-600"
                                                                value={editCommentText}
                                                                onChange={e => setEditCommentText(e.target.value)}
                                                                onKeyDown={e => e.key === 'Enter' && saveEditComment(comment.id)}
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-2 mt-2 text-[10px]">
                                                                <button onClick={() => saveEditComment(comment.id)} className="text-white bg-primary-600 px-2 py-1 rounded font-bold hover:bg-primary-700">Save</button>
                                                                <button onClick={() => setEditingCommentId(null)} className="text-slate-600 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Cancel</button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[#6b7280]">{comment.text}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 italic">No comments yet. Be the first!</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
