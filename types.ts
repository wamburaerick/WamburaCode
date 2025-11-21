export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon identifier
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string[]; // Paragraphs
  codeExample: string;
  visualDesc?: string; // Description for a conceptual visual
  miniTask: {
    description: string;
    starterCode: string;
    solution?: string;
    expectedOutput?: string;
  };
  quiz: Question[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  starterCode: string;
  difficulty: Difficulty;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: Lesson[];
  project?: Project; // Optional embedded project
}

export interface UserProgress {
  completedLessons: string[]; // Lesson IDs
  completedProjects: string[]; // Project IDs
  xp: number;
  streak: number;
  lastLoginDate: string;
  unlockedModules: string[];
  codeAttempts: number;
  badges: string[]; // Badge IDs
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}