import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import { CURRICULUM, BADGES, LEADERBOARD_MOCK, PROJECTS } from './constants';
import LessonView from './components/LessonView';
import CodeEditor from './components/CodeEditor';
import TutorChat from './components/TutorChat';
import ProjectView from './components/ProjectView';
import { Difficulty } from './types';
import { CheckCircle, Trophy, Menu, Play, Medal, Code } from 'lucide-react';

const ModuleList: React.FC<{ onSelectLesson: (mId: string, lId: string) => void }> = ({ onSelectLesson }) => {
    const { progress } = useApp();
    
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Learning Path</h1>
                <p className="text-slate-500">Master Python step-by-step with Erick Wambura.</p>
            </div>
            
            <div className="space-y-6">
                {CURRICULUM.map((module) => {
                    const isCompleted = module.lessons.every(l => progress.completedLessons.includes(l.id));
                    
                    return (
                        <div key={module.id} className="rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                            <div className="p-6 flex justify-between items-start border-b border-slate-100 dark:border-slate-700/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                            module.difficulty === Difficulty.BEGINNER ? 'bg-green-100 text-green-700' : 
                                            module.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{module.difficulty}</span>
                                        {isCompleted && <span className="text-green-500 flex items-center text-xs font-bold"><CheckCircle size={12} className="mr-1"/> Completed</span>}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{module.title}</h2>
                                    <p className="text-slate-500 text-sm mt-1">{module.description}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {module.lessons.map((lesson, idx) => {
                                    const lessonDone = progress.completedLessons.includes(lesson.id);
                                    return (
                                        <button 
                                            key={lesson.id}
                                            onClick={() => onSelectLesson(module.id, lesson.id)}
                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${lessonDone ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-blue-100 dark:group-hover:bg-slate-600 group-hover:text-blue-600 dark:group-hover:text-slate-200'}`}>
                                                    {lessonDone ? <CheckCircle size={16} /> : idx + 1}
                                                </div>
                                                <span className={`font-medium ${lessonDone ? 'text-slate-500' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{lesson.title}</span>
                                            </div>
                                            <Play size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ProjectList: React.FC<{ onSelectProject: (pId: string) => void }> = ({ onSelectProject }) => {
    const { progress } = useApp();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Real-World Projects</h1>
                <p className="text-slate-500">Apply your skills to build real applications from Musoma to the world.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map(project => {
                    const isCompleted = progress.completedProjects.includes(project.id);
                    return (
                        <div key={project.id} className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                                            project.difficulty === Difficulty.BEGINNER ? 'bg-green-100 text-green-700' : 
                                            project.difficulty === Difficulty.INTERMEDIATE ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{project.difficulty}</span>
                                     {isCompleted && <CheckCircle className="text-green-500" size={20} />}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                <p className="text-slate-500 text-sm">{project.description}</p>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Objectives include:</p>
                                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                        {project.objectives.slice(0, 2).map((obj, i) => (
                                            <li key={i} className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-400 rounded-full"/> {obj}</li>
                                        ))}
                                        {project.objectives.length > 2 && <li className="text-xs italic text-slate-400">+ {project.objectives.length - 2} more</li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                                <button 
                                    onClick={() => onSelectProject(project.id)}
                                    className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <Code size={16} /> {isCompleted ? 'Review Code' : 'Start Project'}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const StatsView = () => {
    const { progress } = useApp();
    
    // Insert current user into leaderboard sort
    const fullLeaderboard = [...LEADERBOARD_MOCK, { name: "You", xp: progress.xp, badge: "👤" }]
        .sort((a, b) => b.xp - a.xp);

    return (
        <div className="max-w-4xl mx-auto pb-10">
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Your Progress</h1>
             
             {/* Stat Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{progress.streak} 🔥</div>
                    <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Day Streak</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">{progress.xp}</div>
                    <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Total XP</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{progress.completedLessons.length}</div>
                    <div className="text-slate-500 text-sm uppercase tracking-wider font-semibold">Lessons Completed</div>
                </div>
             </div>

             {/* Badges */}
             <div className="mb-8">
                 <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2"><Medal size={20}/> Badges</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {BADGES.map(badge => {
                         const isUnlocked = progress.badges.includes(badge.id);
                         return (
                             <div key={badge.id} className={`p-4 rounded-xl border text-center transition-all ${isUnlocked ? 'bg-white dark:bg-slate-800 border-yellow-200 dark:border-slate-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale'}`}>
                                 <div className="text-4xl mb-2">{badge.icon}</div>
                                 <div className="font-bold text-sm text-slate-900 dark:text-white">{badge.name}</div>
                                 <div className="text-[10px] text-slate-500 mt-1 leading-tight">{badge.description}</div>
                             </div>
                         )
                     })}
                 </div>
             </div>

             {/* Leaderboard */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                 <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                     <h2 className="text-xl font-bold text-slate-900 dark:text-white">Community Leaderboard</h2>
                     <p className="text-sm text-slate-500">See how you compare to other students.</p>
                 </div>
                 <div className="divide-y divide-slate-200 dark:divide-slate-700">
                     {fullLeaderboard.map((user, idx) => (
                         <div key={idx} className={`flex items-center justify-between p-4 ${user.name === 'You' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                             <div className="flex items-center gap-4">
                                 <span className={`w-8 text-center font-bold ${idx < 3 ? 'text-yellow-500' : 'text-slate-400'}`}>#{idx + 1}</span>
                                 <div className="flex items-center gap-2">
                                     <span className="text-lg">{user.badge}</span>
                                     <span className={`font-medium ${user.name === 'You' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{user.name}</span>
                                 </div>
                             </div>
                             <div className="font-bold text-slate-600 dark:text-slate-400">{user.xp} XP</div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
    )
}

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('learn');
  const [activeItemId, setActiveItemId] = useState<string | null>(null); // Shared ID state for lesson or project
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { progress, newBadge, clearBadgeAlert } = useApp();

  const handleSelectLesson = (mId: string, lId: string) => {
      setActiveItemId(lId);
      setActiveTab('lesson_view');
  };

  const handleSelectProject = (pId: string) => {
      setActiveItemId(pId);
      setActiveTab('project_view');
  }

  const renderContent = () => {
    if (activeTab === 'lesson_view' && activeItemId) {
        const lesson = CURRICULUM.flatMap(m => m.lessons).find(l => l.id === activeItemId);
        if (!lesson) return <div>Lesson not found</div>;
        return <LessonView lesson={lesson} onComplete={() => setActiveTab('learn')} />;
    }

    if (activeTab === 'project_view' && activeItemId) {
        const project = PROJECTS.find(p => p.id === activeItemId);
        if (!project) return <div>Project not found</div>;
        return <ProjectView project={project} onBack={() => setActiveTab('projects')} />;
    }

    switch (activeTab) {
      case 'learn':
        return <ModuleList onSelectLesson={handleSelectLesson} />;
      case 'practice':
        return (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Python Playground</h1>
                <p className="mb-6 text-slate-500">Write and execute arbitrary Python code here.</p>
                <CodeEditor initialCode={`# Write your Python code here\nprint("Hello WamburaCode!")`} height="h-96" />
            </div>
        );
      case 'projects':
          return <ProjectList onSelectProject={handleSelectProject} />
      case 'stats':
          return <StatsView />;
      default:
        return <ModuleList onSelectLesson={handleSelectLesson} />;
    }
  };

  // Context for Tutor
  const getContext = () => {
      if (activeTab === 'lesson_view' && activeItemId) {
           const lesson = CURRICULUM.flatMap(m => m.lessons).find(l => l.id === activeItemId);
           return lesson ? `Lesson: ${lesson.title}` : 'Learning';
      }
      if (activeTab === 'project_view' && activeItemId) {
          const project = PROJECTS.find(p => p.id === activeItemId);
          return project ? `Project: ${project.title}` : 'Coding Project';
      }
      if (activeTab === 'practice') return 'Python Playground / General Coding';
      return 'General Python Navigation';
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
        <Sidebar 
            activeTab={activeTab.includes('view') ? (activeTab === 'lesson_view' ? 'learn' : 'projects') : activeTab} 
            setActiveTab={setActiveTab} 
            isMobileOpen={mobileMenuOpen}
            closeMobile={() => setMobileMenuOpen(false)}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 mr-4 text-slate-600 dark:text-slate-300">
                    <Menu />
                </button>
                <span className="font-bold text-lg">WamburaCode</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
                {renderContent()}
            </div>

            <TutorChat context={getContext()} />

            {/* Badge Notification Toast */}
            {newBadge && (
                <div className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 border border-yellow-400 p-4 rounded-xl shadow-2xl animate-bounce flex items-center gap-3 max-w-sm">
                    <div className="text-3xl">🏆</div>
                    <div>
                        <div className="font-bold text-yellow-600 dark:text-yellow-400">Badge Unlocked!</div>
                        <div className="text-sm">You earned: {newBadge}</div>
                    </div>
                    <button onClick={clearBadgeAlert} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
                </div>
            )}
        </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;