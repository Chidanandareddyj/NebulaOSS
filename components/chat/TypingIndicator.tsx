import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-4 mb-6"
        >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-600 text-gray-200 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
            </div>

            {/* Typing animation */}
            <div className="bg-gray-700 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}