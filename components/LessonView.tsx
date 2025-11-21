import React, { useState, useEffect } from 'react';
import { Lesson, Question } from '../types';
import CodeEditor from './CodeEditor';
import { CheckCircle, HelpCircle, ChevronRight, AlertCircle, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { checkCodeSolution, runPythonCode } from '../services/geminiService';
import { XP_PER_LESSON } from '../constants';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete }) => {
  const { progress, completeLesson } = useApp();
  const isCompleted = progress.completedLessons.includes(lesson.id);
  
  // Task State
  const [userTaskCode, setUserTaskCode] = useState(lesson.miniTask.starterCode);
  const [taskFeedback, setTaskFeedback] = useState<{correct: boolean, msg: string} | null>(null);
  const [checking, setChecking] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(lesson.quiz.length).fill(-1));
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Reset state when lesson changes
  useEffect(() => {
      setUserTaskCode(lesson.miniTask.starterCode);
      setTaskFeedback(null);
      setQuizAnswers(new Array(lesson.quiz.length).fill(-1));
      setShowQuizResults(false);
  }, [lesson]);

  const handleQuizOption = (qIdx: number, oIdx: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[qIdx] = oIdx;
    setQuizAnswers(newAnswers);
  };

  const checkQuiz = () => {
    setShowQuizResults(true);
  };

  const allQuizCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correctAnswer);

  const verifyTask = async () => {
    setChecking(true);
    setTaskFeedback(null);

    // 1. Run the code first to get output
    const output = await runPythonCode(userTaskCode);
    
    // 2. Simple heuristic check (output match)
    if (lesson.miniTask.expectedOutput && output.trim().includes(lesson.miniTask.expectedOutput)) {
        setTaskFeedback({ correct: true, msg: "Great job! Your output matches perfectly." });
        setChecking(false);
        return;
    }

    // 3. If heuristic fails, ask Gemini (LLM evaluation)
    const aiCheck = await checkCodeSolution(userTaskCode, lesson.miniTask.description);
    setTaskFeedback({ correct: aiCheck.correct, msg: aiCheck.feedback });
    setChecking(false);
  };

  const handleFinishLesson = () => {
    completeLesson(lesson.id, XP_PER_LESSON);
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
        {isCompleted && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12}/> Completed</span>}
      </div>

      {/* Content Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 space-y-4">
        {lesson.content.map((para, idx) => (
          <p key={idx} className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            {para.split("`").map((chunk, i) => 
                i % 2 === 1 ? <code key={i} className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-500 font-bold">{chunk}</code> : chunk
            )}
          </p>
        ))}
        
        {lesson.visualDesc && (
             <div className="bg-blue-50 dark:bg-slate-900/50 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl flex items-start gap-3 text-blue-800 dark:text-blue-300 text-sm">
                <HelpCircle className="shrink-0 mt-0.5" size={18}/>
                <p className="italic">{lesson.visualDesc}</p>
             </div>
        )}
      </div>

      {/* Code Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">Example</h3>
        <CodeEditor initialCode={lesson.codeExample} readOnly={false} height="h-48" />
        <p className="text-sm text-slate-500 mt-2 italic">You can edit and run this example to see what happens.</p>
      </div>

      {/* Mini Task */}
      <div className="mb-8 border-t border-slate-200 dark:border-slate-700 pt-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-t-2xl">
            <h3 className="text-xl font-bold flex items-center gap-2"><Terminal size={20}/> Try It Yourself</h3>
            <p className="text-slate-300 mt-2">{lesson.miniTask.description}</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-b-2xl border border-slate-200 dark:border-slate-700 border-t-0">
            <CodeEditor 
                initialCode={userTaskCode} 
                onOutputChange={(out) => {/* optional output tracking */}}
                onChange={(code) => setUserTaskCode(code)}
                height="h-56"
            />
            <div className="p-4 flex items-center justify-between">
                <button 
                    onClick={verifyTask}
                    disabled={checking}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                    {checking ? 'Checking...' : 'Submit Answer'}
                </button>
                {taskFeedback && (
                    <div className={`flex-1 ml-4 px-4 py-2 rounded-lg border text-sm flex items-center gap-2 ${taskFeedback.correct ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                         {taskFeedback.correct ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                         {taskFeedback.msg}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Quick Quiz</h3>
        <div className="space-y-4">
            {lesson.quiz.map((q, qIdx) => (
                <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="font-medium text-slate-900 dark:text-white mb-4">{q.text}</p>
                    <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                            let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all ";
                            const isSelected = quizAnswers[qIdx] === oIdx;
                            
                            if (showQuizResults) {
                                if (oIdx === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300 ";
                                else if (isSelected) btnClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300 ";
                                else btnClass += "border-slate-200 dark:border-slate-700 opacity-50 ";
                            } else {
                                if (isSelected) btnClass += "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 ";
                                else btnClass += "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 ";
                            }

                            return (
                                <button 
                                    key={oIdx}
                                    onClick={() => !showQuizResults && handleQuizOption(qIdx, oIdx)}
                                    className={btnClass}
                                >
                                    {opt}
                                </button>
                            )
                        })}
                    </div>
                    {showQuizResults && (
                        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                            <span className="font-bold">Explanation: </span> {q.explanation}
                        </div>
                    )}
                </div>
            ))}
        </div>
        {!showQuizResults ? (
             <button 
                onClick={checkQuiz}
                disabled={quizAnswers.includes(-1)}
                className="mt-4 w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Check Quiz Answers
            </button>
        ) : (
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={handleFinishLesson}
                    disabled={!allQuizCorrect || (taskFeedback && !taskFeedback.correct)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                    Complete Lesson <ChevronRight />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default LessonView;