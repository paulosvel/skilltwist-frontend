import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
    auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    }
});

export default socket;