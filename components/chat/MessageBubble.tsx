import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    model?: string;
}

interface MessageBubbleProps {
    message: Message;
    isLast: boolean;
}

export default function MessageBubble({ message, isLast }: MessageBubbleProps) {
    const isUser = message.role === 'user';
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                duration: 0.3, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: isLast ? 0.1 : 0 
            }}
            className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-600 text-gray-200'
            }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message content */}
            <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Message bubble */}
                <div className={`relative px-4 py-3 rounded-2xl ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-tr-md'
                        : 'bg-gray-700 text-gray-100 rounded-tl-md'
                }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>

                {/* Metadata */}
                <div className={`flex items-center gap-2 mt-2 text-xs text-gray-400 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                }`}>
                    {message.timestamp && (
                        <span>
                            {format(new Date(message.timestamp), 'HH:mm')}
                        </span>
                    )}
                    {!isUser && message.model && (
                        <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0 h-5 bg-gray-800 border-gray-600 text-gray-300"
                        >
                            {message.model}
                        </Badge>
                    )}
                </div>
            </div>
        </motion.div>
    );
}