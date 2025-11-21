import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Sparkles, Code2 } from 'lucide-react';
import { runPythonCode, analyzeCode } from '../services/geminiService';
import { useApp } from '../context/AppContext';

interface CodeEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  onOutputChange?: (output: string) => void;
  onChange?: (code: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode = '', readOnly = false, onOutputChange, onChange, height = "h-64" }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [review, setReview] = useState('');
  const [activeTab, setActiveTab] = useState<'console' | 'review'>('console');
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { incrementCodeAttempts } = useApp();

  // Update internal state if initialCode prop changes (e.g. switching lessons)
  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setReview('');
  }, [initialCode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      if (onChange) onChange(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;

    // 1. Auto-Indentation on Enter
    if (e.key === 'Enter') {
        e.preventDefault();
        const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const currentLine = value.substring(currentLineStart, selectionStart);
        
        // Calculate current indent
        const match = currentLine.match(/^(\s*)/);
        const currentIndent = match ? match[1] : '';
        
        // Check if line ends with colon (needs extra indent)
        const needsExtraIndent = currentLine.trim().endsWith(':');
        const newIndent = currentIndent + (needsExtraIndent ? '    ' : ''); // 4 spaces

        const newValue = value.substring(0, selectionStart) + '\n' + newIndent + value.substring(selectionEnd);
        
        setCode(newValue);
        if (onChange) onChange(newValue);
        
        // Move cursor
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + newIndent.length;
        }, 0);
    }

    // 2. Auto-closing pairs
    const pairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'"
    };

    if (pairs[e.key]) {
        e.preventDefault();
        const closeChar = pairs[e.key];
        const newValue = value.substring(0, selectionStart) + e.key + closeChar + value.substring(selectionEnd);
        
        setCode(newValue);
        if (onChange) onChange(newValue);

        // Move cursor between the pair
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        }, 0);
    }

    // 3. Tab key support (insert 4 spaces)
    if (e.key === 'Tab') {
        e.preventDefault();
        const newValue = value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
        setCode(newValue);
        if (onChange) onChange(newValue);
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
        }, 0);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('console');
    setOutput("Running...");
    incrementCodeAttempts();

    const result = await runPythonCode(code);
    setOutput(result);
    if (onOutputChange) onOutputChange(result);
    
    setIsRunning(false);
  };

  const handleReview = async () => {
      setIsReviewing(true);
      setActiveTab('review');
      setReview("Analyzing your code with WamburaBot...");
      
      const result = await analyzeCode(code);
      setReview(result);
      setIsReviewing(false);
  };

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800">
      <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-mono text-slate-500">main.py</span>
        {!readOnly && (
          <div className="flex gap-2">
            <button 
              onClick={() => { 
                const reset = initialCode; 
                setCode(reset); 
                if (onChange) onChange(reset);
                setOutput(''); 
                setReview(''); 
              }}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded transition-colors"
              title="Reset Code"
            >
              <RefreshCw size={14} />
            </button>
            <button 
              onClick={handleReview}
              disabled={isReviewing || isRunning}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="AI Code Review"
            >
              <Sparkles size={12} fill="currentColor" />
              {isReviewing ? 'Analyzing...' : 'AI Review'}
            </button>
            <button 
              onClick={handleRun}
              disabled={isRunning || isReviewing}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={12} fill="currentColor" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        )}
      </div>
      
      <div className={`relative flex flex-col md:flex-row ${height}`}>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck="false"
            className="w-full h-full p-4 font-mono text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 leading-relaxed"
            style={{ tabSize: 4 }}
          />
        </div>
        
        {/* Output / Review Panel */}
        {(output || review) && (
            <div className="md:w-1/3 md:border-l border-t md:border-t-0 border-slate-200 dark:border-slate-700 bg-slate-900 flex flex-col">
                <div className="flex border-b border-slate-700">
                    <button 
                        onClick={() => setActiveTab('console')}
                        className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider ${activeTab === 'console' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Console
                    </button>
                    <button 
                        onClick={() => setActiveTab('review')}
                        className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider ${activeTab === 'review' ? 'bg-slate-800 text-purple-300' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        AI Review
                    </button>
                </div>

                <div className="p-4 font-mono text-xs overflow-auto flex-1 text-slate-300 h-full">
                    {activeTab === 'console' ? (
                        <pre className="whitespace-pre-wrap break-words">{output || "No output."}</pre>
                    ) : (
                        <pre className="whitespace-pre-wrap break-words text-purple-100">{review || "Run AI Review to see feedback."}</pre>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;