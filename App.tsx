import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ReportView from './components/ReportView';
import ChatInterface from './components/ChatInterface';
import { generateMarketingPlan } from './services/gemini';
import { BusinessInput, MarketingPlan, AnalysisStatus } from './types';
import { Megaphone, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [marketingPlan, setMarketingPlan] = useState<MarketingPlan | null>(null);
  const [showChat, setShowChat] = useState(false);

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
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
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
            {status === AnalysisStatus.SUCCESS && (
              <div className="flex items-center gap-4 no-print">
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showChat 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {showChat ? 'Tutup Chat' : 'Tanya AI'}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className={`flex-grow w-full transition-all duration-500 ${showChat ? 'lg:w-2/3' : 'lg:w-full'}`}>
              <ReportView plan={marketingPlan} onReset={resetApp} />
            </div>
            
            {showChat && (
              <div className="w-full lg:w-1/3 lg:sticky lg:top-24 animate-slide-in-right no-print">
                <ChatInterface />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;