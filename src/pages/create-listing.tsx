import React from 'react';
import Link from 'next/link';

const ChatList = ({ chats }) => {
    return (
        <div className="chat-list">
            <h2>Chats</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>
                        <Link href={`/chat/${chat.id}`}>
                            <h3>{chat.title}</h3>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;