import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Plus, 
  Minus, 
  Table as TableIcon, 
  Zap, 
  Loader2, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { generateAnalysis, AnalysisType, AnalysisResult } from './services/gemini';

export default function App() {
  const [decision, setDecision] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeType, setActiveType] = useState<AnalysisType>('pros-cons');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (type: AnalysisType = activeType) => {
    if (!decision.trim()) return;
    
    setLoading(true);
    setError(null);
    setActiveType(type);
    
    try {
      const data = await generateAnalysis(decision, type);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const analysisOptions: { id: AnalysisType; label: string; icon: React.ReactNode; description: string }[] = [
    { 
      id: 'pros-cons', 
      label: 'Pros & Cons', 
      icon: <Scale className="w-5 h-5" />, 
      description: 'A balanced look at the advantages and disadvantages.' 
    },
    { 
      id: 'comparison', 
      label: 'Comparison Table', 
      icon: <TableIcon className="w-5 h-5" />, 
      description: 'Side-by-side comparison of your options.' 
    },
    { 
      id: 'swot', 
      label: 'SWOT Analysis', 
      icon: <Zap className="w-5 h-5" />, 
      description: 'Internal strengths/weaknesses and external opportunities/threats.' 
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl tracking-tight">The Tiebreaker</h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span>AI-Powered Decisions</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900">
                What's on your mind?
              </h2>
              <p className="text-zinc-500">
                Describe the decision you're struggling with, and let AI help you weigh the options.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="e.g., Should I move to a new city for a job offer, or stay where I am?"
                  className="w-full min-h-[160px] p-4 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none shadow-sm"
                />
                <div className="absolute bottom-4 right-4 text-xs text-zinc-400">
                  {decision.length} characters
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 px-1">
                  Choose Analysis Style
                </p>
                <div className="grid gap-3">
                  {analysisOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnalyze(option.id)}
                      disabled={loading || !decision.trim()}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all text-left group",
                        activeType === option.id && result
                          ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                          : "bg-white border-zinc-200 hover:border-zinc-400 text-zinc-900"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        activeType === option.id && result ? "bg-zinc-800" : "bg-zinc-100 group-hover:bg-zinc-200"
                      )}>
                        {option.icon}
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {option.label}
                          {loading && activeType === option.id && (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs mt-0.5",
                          activeType === option.id && result ? "text-zinc-400" : "text-zinc-500"
                        )}>
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <Info className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-zinc-200 border-dashed"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-zinc-900" />
                  </div>
                  <h3 className="mt-6 font-display font-bold text-xl">Thinking it through...</h3>
                  <p className="text-zinc-500 mt-2 max-w-xs">
                    Our AI is weighing the possibilities and organizing the data for you.
                  </p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-zinc-900 p-2 rounded-lg">
                          {analysisOptions.find(o => o.id === activeType)?.icon}
                        </div>
                        <h3 className="font-display font-bold text-lg">{result.title}</h3>
                      </div>
                      <button 
                        onClick={() => handleAnalyze()}
                        className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                        title="Regenerate"
                      >
                        <RefreshCw className="w-4 h-4 text-zinc-500" />
                      </button>
                    </div>
                    
                    <div className="p-8">
                      <div className="markdown-body">
                        <ReactMarkdown>{result.content}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900 text-white">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-white/10 rounded-lg shrink-0">
                          <Sparkles className="w-5 h-5 text-zinc-300" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
                            AI Summary
                          </p>
                          <p className="text-lg font-medium leading-snug">
                            {result.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
                    <div className="h-px bg-zinc-200 flex-1" />
                    <span>Decision Assistant</span>
                    <div className="h-px bg-zinc-200 flex-1" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-zinc-200 border-dashed opacity-60"
                >
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <Scale className="w-10 h-10 text-zinc-300" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-zinc-400">No Analysis Yet</h3>
                  <p className="text-zinc-400 mt-2 max-w-xs">
                    Enter your decision on the left and choose an analysis style to get started.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 text-center">
        <p className="text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} The Tiebreaker. Built with Google Gemini.
        </p>
      </footer>
    </div>
  );
}
