import React, { useState } from 'react';

const ChatWindow = ({ messages, onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.isUser ? 'message user' : 'message'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    required
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;