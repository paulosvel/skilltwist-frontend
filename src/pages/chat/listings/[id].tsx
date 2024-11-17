import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import socket from '../../../utils/socket';
import ChatWindow from '../../../components/ChatWindow';
import axiosInstance from '../../../axiosInstance';

export default function ListingChat() {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (id) {
            // Join the chat room for the specific listing
            socket.emit('join:chat', { listingId: id });

            // Listen for new messages
            socket.on(`chat:${id}`, (newMessage) => {
                setMessages(prevMessages => [...prevMessages, {
                    text: newMessage.message,
                    isUser: newMessage.senderId === localStorage.getItem('userId')
                }]);
            });

            // Fetch initial chat history (if needed)
            fetchChatHistory();

            // Cleanup on unmount
            return () => {
                socket.off(`chat:${id}`);
                socket.emit('leave:chat', { listingId: id });
            };
        }
    }, [id]);

    const fetchChatHistory = async () => {
        try {
            const response = await axiosInstance.get(`/messages/${id}`);
            setMessages(response.data.map(msg => ({
                text: msg.message,
                isUser: msg.senderId === localStorage.getItem('userId')
            })));
        } catch (error) {
            console.error('Error fetching chat history:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            }
        }
    };

    const handleSendMessage = (message) => {
        // Emit the message through socket
        socket.emit('send:message', {
            listingId: id,
            message,
        });

        // Optionally, add the message to the local state immediately
        setMessages(prevMessages => [...prevMessages, {
            text: message,
            isUser: true
        }]);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Chat</h1>
            <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage} 
            />
        </div>
    );
}