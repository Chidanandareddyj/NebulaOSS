import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Type definitions
export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    model?: string;
}

export interface Conversation {
    id: string;
    title: string;
    model: string;
    messages: Message[];
    last_message_at: string;
    created_date: string;
}

export interface Model {
    id: string;
    name: string;
    description: string;
}

export interface ChatState {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    selectedModel: string;
    isTyping: boolean;
    sidebarOpen: boolean;
    models: Model[];
}

export type Action =
    | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
    | { type: 'SET_CURRENT_CONVERSATION'; payload: Conversation | null }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'SET_SELECTED_MODEL'; payload: string }
    | { type: 'SET_TYPING'; payload: boolean }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'NEW_CONVERSATION' };

interface ChatContextType {
    state: ChatState;
    dispatch: Dispatch<Action>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    selectedModel: 'deepseek-r1',
    isTyping: false,
    sidebarOpen: true,
    models: [
        {
            id: 'deepseek-r1',
            name: 'DeepSeek R1',
            description: 'Advanced reasoning model with exceptional performance'
        },
        {
            id: 'qwen-2.5',
            name: 'Qwen 2.5',
            description: 'Powerful multilingual model for diverse tasks'
        },
        {
            id: 'llama-3.3',
            name: 'Llama 3.3',
            description: 'Meta\'s latest efficient language model'
        }
    ]
};

function chatReducer(state: ChatState, action: Action): ChatState {
    switch (action.type) {
        case 'SET_CONVERSATIONS':
            return { ...state, conversations: action.payload };
        case 'SET_CURRENT_CONVERSATION':
            return { ...state, currentConversation: action.payload };
        case 'ADD_MESSAGE':
            if (!state.currentConversation) return state;
            const updatedConversation = {
                ...state.currentConversation,
                messages: [...(state.currentConversation.messages || []), action.payload],
                last_message_at: new Date().toISOString()
            };
            return {
                ...state,
                currentConversation: updatedConversation,
                conversations: state.conversations.map(conv => 
                    conv.id === updatedConversation.id ? updatedConversation : conv
                )
            };
        case 'SET_SELECTED_MODEL':
            return { ...state, selectedModel: action.payload };
        case 'SET_TYPING':
            return { ...state, isTyping: action.payload };
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarOpen: !state.sidebarOpen };
        case 'NEW_CONVERSATION':
            const newConv = {
                id: Date.now().toString(),
                title: 'New Chat',
                model: state.selectedModel,
                messages: [],
                last_message_at: new Date().toISOString(),
                created_date: new Date().toISOString()
            };
            return {
                ...state,
                currentConversation: newConv,
                conversations: [newConv, ...state.conversations]
            };
        default:
            return state;
    }
}

export function ChatProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    return (
        <ChatContext.Provider value={{ state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat(): ChatContextType {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
}
