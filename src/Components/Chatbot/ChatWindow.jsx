import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';

const SUGGESTED_QUESTIONS = [
  { text: "Admission Process", icon: "🎓" },
  { text: "School Facilities", icon: "🏫" },
  { text: "Transport Details", icon: "🚌" },
  { text: "Contact Information", icon: "📞" }
];

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      
      const newBotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm unable to connect right now.\n\nPlease try again in a few moments or contact the school administration.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col w-[95vw] sm:w-[420px] h-[85vh] sm:h-[720px] max-h-[calc(100vh-120px)] bg-white/92 backdrop-blur-[30px] rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border border-white/50 font-[Inter] relative">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="h-[80px] flex items-center justify-between px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-sm z-20 shrink-0 relative overflow-hidden">
        {/* Header Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-tr from-white/20 to-white/5 flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Bot size={24} className="text-white drop-shadow-md" />
          </div>
          <div>
            <h3 className="font-bold text-[20px] leading-tight m-0 tracking-tight drop-shadow-md">Vedanta AI</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-[12px] text-blue-50 font-medium tracking-wide">AI School Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 scroll-smooth relative flex flex-col z-10">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col h-full pt-4 items-center justify-center"
            >
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6 shadow-inner border border-white">
                <Bot size={36} className="text-blue-600" />
              </div>
              <h2 className="text-[28px] font-bold text-[#111827] mb-2 tracking-tight">Hello 👋</h2>
              <p className="text-[16px] font-semibold text-blue-600 mb-3">I'm Vedanta AI Assistant</p>
              <p className="text-[14.5px] text-[#4b5563] text-center max-w-[85%] leading-[1.6] mb-8">
                I can help with admissions, academics, facilities, transport, events, and school information.
              </p>
              
              <div className="grid grid-cols-1 gap-3 w-full max-w-[90%] mt-auto pb-4">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(q.text)}
                    className="flex items-center gap-4 bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)] rounded-xl px-5 py-3.5 transition-all duration-300 group"
                  >
                    <span className="text-[20px]">{q.icon}</span>
                    <span className="text-left text-[14px] font-semibold text-[#1f2937] group-hover:text-blue-600 transition-colors">
                      {q.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6 pb-2">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex max-w-[85%] gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-white/20">
                        <Bot size={18} className="text-white" />
                      </div>
                    </div>
                    <div className="bg-white text-[#111827] border border-[#e5e7eb] rounded-[20px] rounded-tl-[6px] px-5 py-4 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center gap-1.5 h-[46px]">
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 bg-[#9ca3af] rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-[#9ca3af] rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -4, 0] }} 
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-[#9ca3af] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/50 z-20 shrink-0">
        <div className="relative flex items-center bg-white rounded-full h-[64px] shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#f3f4f6] focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.08)] focus-within:border-blue-100 transition-all duration-300">
          <button className="absolute left-2 p-2.5 text-[#9ca3af] hover:text-[#4b5563] transition-colors rounded-full hover:bg-gray-50 z-10 flex items-center justify-center">
            <Paperclip size={22} />
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Vedanta AI..."
            className="w-full bg-transparent text-[#111827] pl-[60px] pr-[68px] h-full focus:outline-none placeholder:text-[#9ca3af] text-[15px] font-medium"
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 transition-all duration-300 shadow-[0_4px_10px_rgba(37,99,235,0.3)] disabled:shadow-none flex items-center justify-center h-[48px] w-[48px]"
            aria-label="Send message"
          >
            <Send size={20} className={inputValue.trim() && !isLoading ? "translate-x-[1px]" : ""} />
          </motion.button>
        </div>
        <div className="text-center mt-3 mb-1">
          <span className="text-[11px] text-[#9ca3af] font-medium tracking-wide">AI-generated content may be inaccurate.</span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
