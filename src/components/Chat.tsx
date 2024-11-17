import { useEffect, useState } from 'react';
import useChatStore from '../store/chatStore';

const Chat = ({ receiverId }) => {
    const { messages, addMessage, connectSocket, sendMessage } = useChatStore();
    const [message, setMessage] = useState('');

    useEffect(() => {
        connectSocket();
    }, [connectSocket]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                senderId: YOUR_USER_ID, // Replace with actual user ID
                receiverId,
                message,
            };
            sendMessage(newMessage);
            addMessage(newMessage); // Optionally add to local state
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId}: </strong>
                        {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;