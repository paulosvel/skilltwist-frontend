import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ChatWindow from '../../components/ChatWindow';
import axiosInstance from '../../axiosInstance';
import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Your backend URL

const Chat = () => {
    const router = useRouter();
    const { id } = router.query;
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (id) {
                try {
                    const response = await axiosInstance.get(`/chats/${id}`);
                    setMessages(response.data.messages);
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [id]);

    const handleSendMessage = async (message) => {
        try {
            const response = await axiosInstance.post(`/chats/${id}/messages`, { text: message });
            socket.emit('sendMessage', response.data); // Emit the new message
            setMessages((prevMessages) => [...prevMessages, response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <h1>Chat with {user?.name}</h1>
            <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
        </div>
    );
};

export default Chat;