import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from './ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { MessageSquare } from 'lucide-react';

export default function ChatArea() {
    const { state } = useChat();
    const { currentConversation, isTyping } = state;
    const scrollAreaRef = useRef(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentConversation?.messages, isTyping]);

    if (!currentConversation) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-300 mb-2">
                        Start a new conversation
                    </h2>
                    <p className="text-gray-400 max-w-md">
                        Select a model and start chatting, or choose a previous conversation from the sidebar.
                    </p>
                </motion.div>
            </div>
        );
    }

    const messages = currentConversation.messages || [];

    return (
        <div className="flex-1 flex flex-col">
            {/* Messages area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
                <div className="max-w-4xl mx-auto py-8">
                    <AnimatePresence mode="popLayout">
                        {messages.map((message, index) => (
                            <MessageBubble
                                key={`${currentConversation.id}-${index}`}
                                message={message}
                                isLast={index === messages.length - 1}
                            />
                        ))}
                        {isTyping && <TypingIndicator key="typing" />}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
        </div>
    );
}