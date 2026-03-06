import { UserCourseProgressState } from '../../types';

// In-memory store backed by localStorage
export let USER_COURSE_PROGRESS: Record<string, UserCourseProgressState> = {};

export const loadProgress = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('user_course_progress');
        if (stored) {
            try {
                USER_COURSE_PROGRESS = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse course progress", e);
                USER_COURSE_PROGRESS = {};
            }
        }
    }
};

export const saveProgress = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user_course_progress', JSON.stringify(USER_COURSE_PROGRESS));
    }
};

// Initialize
loadProgress();
