import { create } from 'zustand';
import { socketService } from '../services/socket';

interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp?: Date;
}

interface ChatStore {
    messages: Message[];
    isConnected: boolean;
    connectSocket: (token: string) => void;
    disconnectSocket: () => void;
    addMessage: (message: Message) => void;
    sendMessage: (message: Message) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    isConnected: false,

    connectSocket: (token: string) => {
        const socket = socketService.connect(token);
        
        socket.on('direct_message', (message: Message) => {
            get().addMessage(message);
        });

        socket.on('connect', () => {
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });
    },

    disconnectSocket: () => {
        socketService.disconnect();
        set({ isConnected: false });
    },

    addMessage: (message: Message) => {
        set((state) => ({
            messages: [...state.messages, { ...message, timestamp: new Date() }]
        }));
    },

    sendMessage: (message: Message) => {
        socketService.sendDirectMessage(message.receiverId, message.message);
        // Optionally add message to local state immediately for optimistic updates
        get().addMessage(message);
    }
}));

export default useChatStore;
