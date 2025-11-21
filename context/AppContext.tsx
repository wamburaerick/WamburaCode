import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { BADGES } from '../constants';

interface AppContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, xpEarned: number) => void;
  completeProject: (projectId: string, xpEarned: number) => void;
  incrementCodeAttempts: () => void;
  resetProgress: () => void;
  newBadge: string | null;
  clearBadgeAlert: () => void;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  completedProjects: [],
  xp: 0,
  streak: 1,
  lastLoginDate: new Date().toDateString(),
  // Defaulting all modules to unlocked as per request to allow full access
  unlockedModules: ['m1-intro', 'm2-control', 'm3-structures', 'm4-advanced'],
  codeAttempts: 0,
  badges: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('wamburacode_progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('wamburacode_progress', JSON.stringify(progress));
  }, [progress]);

  // Streak logic on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastLoginDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (progress.lastLoginDate === yesterday.toDateString()) {
            const newStreak = progress.streak + 1;
            setProgress(prev => ({ ...prev, streak: newStreak, lastLoginDate: today }));
            if (newStreak >= 3) checkForBadge('b2-streak', { ...progress, streak: newStreak });
        } else {
            setProgress(prev => ({ ...prev, streak: 1, lastLoginDate: today }));
        }
    }
  }, []);

  const checkForBadge = (badgeId: string, currentProgress: UserProgress) => {
      if (!currentProgress.badges.includes(badgeId)) {
          const badge = BADGES.find(b => b.id === badgeId);
          if (badge) {
              setProgress(prev => ({ ...prev, badges: [...prev.badges, badgeId] }));
              setNewBadge(badge.name);
          }
      }
  };

  const completeLesson = (lessonId: string, xpEarned: number) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const updatedLessons = [...progress.completedLessons, lessonId];
      const updatedXP = progress.xp + xpEarned;
      
      setProgress(prev => ({
        ...prev,
        completedLessons: updatedLessons,
        xp: updatedXP
      }));

      // Badge Logic Checks
      // 1. First Lesson
      if (updatedLessons.length === 1) checkForBadge('b1-initiate', { ...progress, completedLessons: updatedLessons });
      
      // 2. Module 1 Complete (Check if all m1 lessons done)
      const m1Lessons = ['l1-hello', 'l2-vars'];
      if (m1Lessons.every(id => updatedLessons.includes(id))) {
          checkForBadge('b3-mod1', { ...progress, completedLessons: updatedLessons });
      }

      // 3. Level 5 (500XP)
      if (updatedXP >= 500) {
          checkForBadge('b4-master', { ...progress, xp: updatedXP });
      }
    }
  };

  const completeProject = (projectId: string, xpEarned: number) => {
      if (!progress.completedProjects.includes(projectId)) {
          setProgress(prev => ({
              ...prev,
              completedProjects: [...prev.completedProjects, projectId],
              xp: prev.xp + xpEarned
          }));
      }
  };

  const incrementCodeAttempts = () => {
      setProgress(prev => ({...prev, codeAttempts: prev.codeAttempts + 1}));
  };

  const resetProgress = () => {
      setProgress(defaultProgress);
  };

  const clearBadgeAlert = () => setNewBadge(null);

  return (
    <AppContext.Provider value={{ progress, completeLesson, completeProject, incrementCodeAttempts, resetProgress, newBadge, clearBadgeAlert }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};