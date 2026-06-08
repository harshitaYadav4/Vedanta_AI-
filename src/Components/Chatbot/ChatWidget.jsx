import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  return (
    <div className="fixed bottom-[40px] right-[40px] z-[9999] flex flex-col items-end" style={{ fontFamily: '"Inter", sans-serif' }}>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 origin-bottom-right"
          >
            <ChatWindow onClose={toggleChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ y: -6, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          y: isOpen ? 0 : [0, -8, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-[36px] focus:outline-none z-[10000] border border-white/20 backdrop-blur-md overflow-hidden ${
          isOpen 
            ? 'bg-white/90 text-[#2563eb] shadow-[0_20px_40px_rgba(0,0,0,0.15)] rotate-90' 
            : 'text-white shadow-[0_20px_40px_rgba(37,99,235,0.35)]'
        }`}
        style={{
          background: isOpen ? 'white' : 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)'
        }}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {!isOpen && (
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0"
          />
        )}
        
        {isOpen ? (
          <X size={32} className="transform -rotate-90" />
        ) : (
          <Bot size={34} />
        )}
        
        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[24px] w-[24px] items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-[24px] w-[24px] bg-red-500 border-[2.5px] border-white text-white text-[12px] font-bold items-center justify-center shadow-md">
              {unreadCount}
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
