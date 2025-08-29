import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    MessageSquare, 
    Plus, 
    PanelLeftClose, 
    PanelLeftOpen,
    Trash2,
    Edit
} from 'lucide-react';
import { useChat, Conversation } from './ChatContext';
import { format, isToday, isYesterday, subDays } from 'date-fns';

export default function Sidebar() {
    const { state, dispatch } = useChat();
    const { conversations, currentConversation, sidebarOpen } = state;

    const handleNewChat = () => {
        dispatch({ type: 'NEW_CONVERSATION' });
    };

    const handleSelectConversation = (conversation: Conversation) => {
        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
    };

    interface ConversationGroups {
        today: Conversation[];
        yesterday: Conversation[];
        last7Days: Conversation[];
        older: Conversation[];
    }

    const groupConversationsByDate = (conversations: Conversation[]): ConversationGroups => {
        const groups: ConversationGroups = {
            today: [],
            yesterday: [],
            last7Days: [],
            older: []
        };

        conversations.forEach(conv => {
            const date = new Date(conv.last_message_at || conv.created_date);
            if (isToday(date)) {
                groups.today.push(conv);
            } else if (isYesterday(date)) {
                groups.yesterday.push(conv);
            } else if (date >= subDays(new Date(), 7)) {
                groups.last7Days.push(conv);
            } else {
                groups.older.push(conv);
            }
        });

        return groups;
    };

    const groups = groupConversationsByDate(conversations);

    const ConversationItem = ({ conversation, isActive }: { conversation: Conversation; isActive: boolean }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
            <Button
                variant="ghost"
                className={`w-full justify-start h-auto p-3 text-left transition-all duration-200 ${
                    isActive 
                        ? 'bg-white/10 text-white border-l-2 border-blue-500' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => handleSelectConversation(conversation)}
            >
                <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {conversation.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {conversation.messages?.length || 0} messages
                    </p>
                </div>
            </Button>
        </motion.div>
    );

    const ConversationGroup = ({ title, conversations }: { title: string; conversations: Conversation[] }) => {
        if (conversations.length === 0) return null;
        
        return (
            <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 px-3">
                    {title}
                </h3>
                <div className="space-y-1">
                    {conversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isActive={currentConversation?.id === conv.id}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="bg-gray-900 border-r border-gray-700 flex flex-col h-screen overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-xl font-bold text-white">Chats</h1>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                                    className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                    <PanelLeftClose className="w-5 h-5" />
                                </Button>
                            </div>
                            <Button
                                onClick={handleNewChat}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Chat
                            </Button>
                        </div>

                        {/* Conversations */}
                        <ScrollArea className="flex-1 px-2">
                            <div className="py-4">
                                <ConversationGroup title="Today" conversations={groups.today} />
                                <ConversationGroup title="Yesterday" conversations={groups.yesterday} />
                                <ConversationGroup title="Last 7 Days" conversations={groups.last7Days} />
                                <ConversationGroup title="Older" conversations={groups.older} />
                            </div>
                        </ScrollArea>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-700">
                            <p className="text-xs text-gray-400 text-center">
                                ChatGPT-style Interface
                            </p>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Sidebar toggle when closed */}
            {!sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed top-4 left-4 z-50"
                >
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                        className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                        <PanelLeftOpen className="w-5 h-5" />
                    </Button>
                </motion.div>
            )}
        </>
    );
}