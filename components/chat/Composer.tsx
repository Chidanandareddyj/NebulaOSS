import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, ArrowUp } from 'lucide-react';
import { useChat } from './ChatContext';

export default function Composer() {
    const { state, dispatch } = useChat();
    const { selectedModel, models, isTyping, currentConversation } = state;
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    interface MockApiResponse {
        [key: string]: string;
    }

    interface Message {
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
        model?: string;
    }

    const mockApiCall = async (model: string, messages: Message[]): Promise<string> => {
        // Mock delay to simulate API call
        const delay: number = Math.random() * 700 + 500;
        await new Promise<void>(resolve => setTimeout(resolve, delay));
        
        // Mock responses based on model
        const responses: MockApiResponse = {
            'deepseek-r1': "I'm DeepSeek R1, an advanced reasoning model. I can help you with complex problems that require step-by-step thinking and analysis.",
            'qwen-2.5': "Hello! I'm Qwen 2.5, a multilingual AI assistant. I can help you in multiple languages and with various tasks.",
            'llama-3.3': "Hi there! I'm Llama 3.3 from Meta. I'm designed to be efficient and helpful for a wide range of conversations."
        };

        return responses[model] || "Hello! How can I help you today?";
    };

    const handleSubmit = async () => {
        if (!message.trim() || isTyping) return;
        
        // Ensure we have a conversation
        if (!currentConversation) {
            dispatch({ type: 'NEW_CONVERSATION' });
        }

        const userMessage = {
            role: 'user' as const,
            content: message.trim(),
            timestamp: new Date().toISOString()
        };

        // Add user message
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
        
        // Clear input and show typing
        setMessage('');
        dispatch({ type: 'SET_TYPING', payload: true });

        try {
            // Mock API call
            const response = await mockApiCall(selectedModel, [userMessage]);
            
            const assistantMessage = {
                role: 'assistant' as const,
                content: response,
                model: selectedModel,
                timestamp: new Date().toISOString()
            };

            dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
        } catch (error) {
            const errorMessage = {
                role: 'assistant' as const,
                content: 'Sorry, I encountered an error. Please try again.',
                model: selectedModel,
                timestamp: new Date().toISOString()
            };
            dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
        } finally {
            dispatch({ type: 'SET_TYPING', payload: false });
        }
    };

    interface KeyDownEvent {
        key: string;
        shiftKey: boolean;
        preventDefault: () => void;
    }

    const handleKeyDown = (e: KeyDownEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const selectedModelInfo = models.find(m => m.id === selectedModel);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm"
        >
            <div className="max-w-4xl mx-auto px-4 py-4">
                {/* Model selector */}
                <div className="mb-4 flex justify-center">
                    <Select
                        value={selectedModel}
                        onValueChange={(value) => dispatch({ type: 'SET_SELECTED_MODEL', payload: value })}
                    >
                        <SelectTrigger className="w-64 bg-gray-700 border-gray-600 text-gray-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                            {models.map(model => (
                                <SelectItem 
                                    key={model.id} 
                                    value={model.id}
                                    className="text-gray-100 focus:bg-gray-600"
                                >
                                    <div>
                                        <div className="font-medium">{model.name}</div>
                                        <div className="text-xs text-gray-400">{model.description}</div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Message input */}
                <div className="relative">
                    <div className="flex items-end gap-3 bg-gray-700 rounded-2xl p-3">
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${selectedModelInfo?.name || 'AI'}...`}
                            className="flex-1 bg-transparent border-none resize-none min-h-[20px] max-h-32 text-gray-100 placeholder-gray-400 focus-visible:ring-0"
                            rows={1}
                            disabled={isTyping}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={!message.trim() || isTyping}
                            size="icon"
                            className={`rounded-full w-8 h-8 transition-all duration-200 ${
                                message.trim() && !isTyping
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-600 text-gray-400'
                            }`}
                        >
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </motion.div>
    );
}
