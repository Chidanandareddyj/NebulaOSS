'use client'
import React, { useEffect } from 'react';
import { ChatProvider, useChat } from '@/components/chat/ChatContext';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import Composer from '@/components/chat/Composer';

function ChatAppContent() {
    const { state, dispatch } = useChat();

    // Load mock conversations on mount
    useEffect(() => {
        const mockConversations = [
            {
                id: '1',
                title: 'Getting Started with AI',
                model: 'deepseek-r1',
                messages: [
                    {
                        role: 'user' as const,
                        content: 'Hello! Can you help me understand how AI works?',
                        timestamp: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                        role: 'assistant' as const,
                        content: 'Hello! I\'d be happy to help you understand AI. Artificial Intelligence is a broad field that involves creating systems that can perform tasks typically requiring human intelligence...',
                        model: 'deepseek-r1',
                        timestamp: new Date(Date.now() - 3500000).toISOString()
                    }
                ],
                last_message_at: new Date(Date.now() - 3500000).toISOString(),
                created_date: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '2',
                title: 'Code Review Help',
                model: 'qwen-2.5',
                messages: [
                    {
                        role: 'user' as const,
                        content: 'Can you review this JavaScript function for me?',
                        timestamp: new Date(Date.now() - 86400000).toISOString()
                    },
                    {
                        role: 'assistant' as const,
                        content: 'I\'d be happy to review your JavaScript code! Please share the function you\'d like me to look at.',
                        model: 'qwen-2.5',
                        timestamp: new Date(Date.now() - 86300000).toISOString()
                    }
                ],
                last_message_at: new Date(Date.now() - 86300000).toISOString(),
                created_date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: '3',
                title: 'Creative Writing',
                model: 'llama-3.3',
                messages: [
                    {
                        role: 'user' as const,
                        content: 'Help me write a short story about a time traveler',
                        timestamp: new Date(Date.now() - 172800000).toISOString()
                    }
                ],
                last_message_at: new Date(Date.now() - 172800000).toISOString(),
                created_date: new Date(Date.now() - 172800000).toISOString()
            }
        ];

        dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: mockConversations[0] });
    }, [dispatch]);

    return (
        <div className="h-screen bg-gray-900 text-gray-100 flex overflow-hidden">
            <Sidebar />
            
            <div className="flex-1 flex flex-col min-w-0">
                <ChatArea />
                <Composer />
            </div>
        </div>
    );
}

export default function ChatApp() {
    return (
        <ChatProvider>
            <ChatAppContent />
        </ChatProvider>
    );
}
