
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';
import HistoryList from './components/HistoryList';
import { generateMarketingPlan } from './services/gemini';
import { auth } from './services/firebase';
import firebase from 'firebase/compat/app';
import { BusinessInput, MarketingPlan, AnalysisStatus, HistoryItem } from './types';
import { Megaphone, Sparkles, LogOut, Loader2, CheckCircle, BrainCircuit, Search, BarChart3, PenTool } from 'lucide-react';

const ANALYSIS_STEPS = [
  { icon: <Search className="w-5 h-5" />, label: "Menganalisis Industri & Tren Pasar", duration: 2500 },
  { icon: <BrainCircuit className="w-5 h-5" />, label: "Mempelajari Kompetitor & Celah Pasar", duration: 3000 },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Merumuskan Strategi SWOT & 4P", duration: 2500 },
  { icon: <PenTool className="w-5 h-5" />, label: "Menyusun Ide Konten Kreatif", duration: 2000 },
  { icon: <Sparkles className="w-5 h-5" />, label: "Finalisasi Laporan Strategi", duration: 2000 },
];

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<firebase.User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>('');
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Loading Animation State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('marko_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Effect to handle the progressive loading steps
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (status === AnalysisStatus.LOADING) {
      setCurrentStepIndex(0);
      
      const advanceStep = (index: number) => {
        if (index < ANALYSIS_STEPS.length - 1) {
          timeout = setTimeout(() => {
            setCurrentStepIndex(index + 1);
            advanceStep(index + 1);
          }, ANALYSIS_STEPS[index].duration);
        }
      };

      advanceStep(0);
    }

    return () => clearTimeout(timeout);
  }, [status]);

  const handleFormSubmit = async (data: BusinessInput) => {
    setStatus(AnalysisStatus.LOADING);
    try {
      const plan = await generateMarketingPlan(data);
      setMarketingPlan(plan);
      
      // Save to History
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        businessName: data.businessName,
        industry: data.industry,
        plan: plan
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('marko_history', JSON.stringify(updatedHistory));

      // Ensure we show the last step briefly before showing success
      setCurrentStepIndex(ANALYSIS_STEPS.length - 1);
      setTimeout(() => {
        setStatus(AnalysisStatus.SUCCESS);
      }, 1000);
    } catch (error) {
      console.error("Failed to generate plan", error);
      setStatus(AnalysisStatus.ERROR);
      alert("Terjadi kesalahan saat membuat strategi. Pastikan API Key valid dan coba lagi.");
    }
  };

  const resetApp = () => {
    setMarketingPlan(null);
    setStatus(AnalysisStatus.IDLE);
    setShowChat(false);
    setChatInitialMessage('');
    setCurrentStepIndex(0);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setMarketingPlan(item.plan);
    setStatus(AnalysisStatus.SUCCESS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHistoryDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus riwayat strategi ini?')) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('marko_history', JSON.stringify(updatedHistory));
    }
  };

  const handleAskAI = (message: string) => {
    setShowChat(true);
    setChatInitialMessage(message);
    if (!showChat) {
      setTimeout(() => {
        const chatInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (chatInput) chatInput.focus();
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Optional: Clear history on logout if you want privacy per session, 
      // but localStorage is browser-based so usually kept.
      // setHistory([]); 
      resetApp();
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Memuat Aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 print:bg-white print:pb-0">
      {/* Navigation Bar - Hidden in Print */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div 
                className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-200 flex items-center justify-center relative group cursor-pointer"
                onClick={resetApp}
              >
                <Megaphone className="h-5 w-5 text-white" />
                <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div onClick={resetApp} className="cursor-pointer">
                 <span className="font-extrabold text-xl tracking-tight text-slate-800 flex items-center gap-1">
                  Marko <span className="text-indigo-600">AI</span>
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider -mt-1">Marketing Strategist</p>
              </div>
            </div>

            <div className="flex items-center gap-4 no-print">
              {status === AnalysisStatus.SUCCESS && (
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`hidden md:block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showChat 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {showChat ? 'Tutup Chat' : 'Tanya AI'}
                </button>
              )}
              
              <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
              
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        {status === AnalysisStatus.IDLE && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Konsultan Marketing & Investasi <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Profesional AI
                </span>
              </h1>
              <p className="text-lg text-slate-600">
                Masukkan detail bisnis Anda, dan AI kami akan merancang strategi, analisis kompetitor, dan rekomendasi investasi untuk mengembangkan usaha Anda.
              </p>
            </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={false} />
            
            <HistoryList 
              history={history} 
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
            />
          </div>
        )}

        {status === AnalysisStatus.LOADING && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-full h-full bg-white rounded-full border-2 border-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Sedang Meracik Strategi</h3>
              <p className="text-slate-500 mt-2 text-sm">
                Mohon tunggu, Marko sedang menganalisis data bisnis Anda...
              </p>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-100"></div>
              {ANALYSIS_STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const isPending = index > currentStepIndex;

                return (
                  <div key={index} className="relative flex items-center gap-4 z-10">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                        isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                        isActive ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-200' : 
                        'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                       isActive ? <Loader2 className="w-4 h-4 animate-spin" /> :
                       <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    
                    <div className={`flex-1 transition-all duration-500 ${isActive ? 'translate-x-1' : ''}`}>
                      <p className={`text-sm font-medium transition-colors duration-300 ${
                        isCompleted ? 'text-slate-500' : 
                        isActive ? 'text-indigo-700 font-bold' : 
                        'text-slate-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>

                    {isActive && (
                      <div className="animate-fade-in text-indigo-600">
                        {step.icon}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${((currentStepIndex + 0.5) / ANALYSIS_STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.SUCCESS && marketingPlan && (
          <div className="flex flex-col lg:flex-row gap-8 items-start print:block">
            <div className={`flex-grow w-full transition-all duration-500 ${showChat ? 'lg:w-2/3' : 'lg:w-full'} print:w-full`}>
              <ReportView 
                plan={marketingPlan} 
                onReset={resetApp} 
                onAskAI={handleAskAI}
              />
            </div>
            
            {showChat && (
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24 animate-slide-in-right no-print">
                <ChatInterface 
                  initialMessage={chatInitialMessage} 
                  onMessageSent={() => setChatInitialMessage('')}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
