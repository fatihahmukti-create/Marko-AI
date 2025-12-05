import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createChatSession } from '../services/gemini';
import { Chat, GenerateContentResponse } from '@google/genai';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    const session = createChatSession();
    setChatSession(session);
    
    // Add initial greeting
    setMessages([{
      role: 'model',
      content: 'Halo! Saya Marko. Ada pertanyaan tentang strategi pemasaran Anda atau butuh ide konten spesifik? Tanyakan saja!'
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Stream the response
      const result = await chatSession.sendMessageStream({ message: userMsg.content });
      
      let fullResponse = '';
      const botMsgId = Date.now();
      
      // Add placeholder message for streaming
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { role: 'model', content: fullResponse };
            return newMsgs;
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Maaf, terjadi kesalahan saat memproses pesan Anda." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          Diskusi dengan Marko (AI)
        </h3>
        <p className="text-xs text-slate-500">Tanyakan detail strategi atau ide konten harian</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-none'
            }`}>
              {msg.role === 'model' ? (
                 <ReactMarkdown 
                 components={{
                   ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2" {...props} />,
                   ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2" {...props} />,
                   strong: ({node, ...props}) => <strong className="font-bold" {...props} />
                 }}
               >
                 {msg.content}
               </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
               <Bot className="w-4 h-4" />
             </div>
             <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
               <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            placeholder="Ketik pesan Anda..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
