import create from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:YOUR_BACKEND_PORT'); // Replace with your backend port

const useChatStore = create((set) => ({
    messages: [],
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    connectSocket: () => {
        socket.on('newMessage', (message) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });
    },
    sendMessage: (message) => {
        socket.emit('sendMessage', message);
    },
}));

export default useChatStore;