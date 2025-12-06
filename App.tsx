import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';
import { generateMarketingPlan } from './services/gemini';
import { auth } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { BusinessInput, MarketingPlan, AnalysisStatus } from './types';
import { Megaphone, Sparkles, LogOut, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App State
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFormSubmit = async (data: BusinessInput) => {
    setStatus(AnalysisStatus.LOADING);
    try {
      const plan = await generateMarketingPlan(data);
      setMarketingPlan(plan);
      setStatus(AnalysisStatus.SUCCESS);
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
      await signOut(auth);
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
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-indigo-200 flex items-center justify-center relative group">
                <Megaphone className="h-5 w-5 text-white" />
                <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
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
          </div>
        )}

        {status === AnalysisStatus.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 border-r-transparent border-b-indigo-600 border-l-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-8 h-8 animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800">Sedang Meracik Strategi...</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">
                Marko sedang menganalisis tren pasar, mempelajari kompetitor, dan menghitung estimasi investasi terbaik.
              </p>
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
