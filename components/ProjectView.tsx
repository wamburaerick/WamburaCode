import React, { useState } from 'react';
import { Project } from '../types';
import CodeEditor from './CodeEditor';
import { useApp } from '../context/AppContext';
import { checkCodeSolution } from '../services/geminiService';
import { XP_PER_PROJECT } from '../constants';
import { CheckCircle, Rocket, AlertTriangle, ChevronLeft } from 'lucide-react';

interface ProjectViewProps {
  project: Project;
  onBack: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
  const { progress, completeProject } = useApp();
  const [code, setCode] = useState(project.starterCode);
  const [verifying, setVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{correct: boolean, msg: string} | null>(null);

  const isCompleted = progress.completedProjects.includes(project.id);

  const handleSubmit = async () => {
    setVerifying(true);
    setFeedback(null);

    // For projects, we rely on AI to check logic since exact output matching is too brittle
    const result = await checkCodeSolution(
        code, 
        `Project Verification for '${project.title}'. Objectives: ${project.objectives.join(', ')}`
    );

    setFeedback({ correct: result.correct, msg: result.feedback });
    
    if (result.correct) {
        completeProject(project.id, XP_PER_PROJECT);
    }
    
    setVerifying(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft size={16} /> Back to Projects
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                {project.title}
                {isCompleted && <CheckCircle className="text-green-500" size={24} />}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">{project.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : 
              project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-red-100 text-red-700'
            }`}>
            {project.difficulty}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Instructions Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-y-auto custom-scrollbar">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Rocket size={18} className="text-blue-500"/> Objectives</h3>
            <ul className="space-y-3">
                {project.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i+1}</span>
                        {obj}
                    </li>
                ))}
            </ul>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-900/50 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> Use the "AI Review" feature in the editor if you get stuck! It acts like a pair programmer.
            </div>

            {feedback && (
                <div className={`mt-6 p-4 rounded-xl border ${feedback.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <div className="flex items-center gap-2 font-bold mb-2">
                        {feedback.correct ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        {feedback.correct ? 'Project Complete!' : 'Needs Improvement'}
                    </div>
                    <p className="text-sm">{feedback.msg}</p>
                </div>
            )}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
            <CodeEditor 
                initialCode={code} 
                onChange={setCode}
                height="h-full"
            />
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSubmit}
                    disabled={verifying}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {verifying ? 'Verifying...' : 'Submit Project'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;