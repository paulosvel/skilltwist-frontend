import { create } from 'zustand';
import axiosInstance from '../src/axiosInstance';

interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  createOrGetConversation: (userId: string) => Promise<Conversation>;
  setCurrentConversation: (conversation: Conversation) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,

  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/api/conversations');
      set({ conversations: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch conversations', loading: false });
      console.error('Error fetching conversations:', error);
    }
  },

  createOrGetConversation: async (userId: string) => {
    try {
      const response = await axiosInstance.post('/api/conversations', { userId });
      const newConversation = response.data;
      
      set(state => ({
        conversations: [...state.conversations, newConversation],
        currentConversation: newConversation
      }));
      
      return newConversation;
    } catch (error) {
      set({ error: 'Failed to create conversation' });
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  setCurrentConversation: (conversation: Conversation) => {
    set({ currentConversation: conversation });
  }
}));

export default useChatStore;