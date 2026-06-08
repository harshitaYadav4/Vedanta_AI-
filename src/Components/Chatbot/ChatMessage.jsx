import React from 'react';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`} 
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <User size={16} className="text-gray-600" />
            </div>
          ) : (
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md border border-white/20">
              <Bot size={18} className="text-white" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 max-w-full`}>
          <div
            className={`px-5 py-4 text-[14.5px] leading-[1.65] shadow-[0_4px_15px_rgba(0,0,0,0.03)] ${
              isUser
                ? 'bg-gradient-to-br from-[#2563eb] to-[#4f46e5] text-white rounded-[22px] rounded-tr-[6px]'
                : 'bg-white text-[#111827] border border-[#f3f4f6] rounded-[22px] rounded-tl-[6px]'
            }`}
            style={{ 
              wordBreak: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              maxWidth: '100%'
            }}
          >
            {/* Simple markdown bold renderer */}
            {message.content.split('\n').map((line, i) => (
              <span key={i} className={i !== 0 ? 'block mt-2' : ''}>
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                })}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[#9ca3af] mt-2 px-1 font-medium tracking-wide">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
