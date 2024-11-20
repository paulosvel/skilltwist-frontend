import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import socket from '../../../utils/socket';
import ChatWindow from '../../../components/ChatWindow';
import axiosInstance from '../../../axiosInstance';

interface Listing {
    _id: string;
    userId: string;
    skillOffered: string;
    skillNeeded: string;
    description: string;
}

interface Message {
    _id: string;
    listingId: string;
    senderId: string;
    message: string;
}

export default function ListingChat() {
    const router = useRouter();
    const { id } = router.query;
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await axiosInstance.get(`/messages/${id}`);
                setListing(response.data);
                setError(null);
            } catch (error: any) {
                console.error('Error fetching listing:', error);
                setError('Failed to load listing details');
                if (error.response?.status === 401) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id, router]);

    useEffect(() => {
        if (listing) {
            // Join the chat room for the specific listing
            socket.emit('join:chat', { listingId: id });

            // Listen for new messages
            socket.on(`chat:${id}`, (newMessage: Message) => {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            });

            // Fetch initial chat history (if needed)
            fetchChatHistory();

            // Cleanup on unmount
            return () => {
                socket.off(`chat:${id}`);
                socket.emit('leave:chat', { listingId: id });
            };
        }
    }, [listing, id]);

    const fetchChatHistory = async () => {
        try {
            const response = await axiosInstance.get(`/messages/${id}`);
            setMessages(response.data);
        } catch (error: any) {
            console.error('Error fetching chat history:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            }
        }
    };

    const handleSendMessage = (message: string) => {
        // Emit the message through socket
        socket.emit('send:message', {
            listingId: id,
            message,
        });

        // Optionally, add the message to the local state immediately
        setMessages(prevMessages => [...prevMessages, {
            _id: '',
            listingId: id,
            senderId: localStorage.getItem('userId') as string,
            message,
        }]);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!listing) return <div>Listing not found</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">Chat about: {listing.skillOffered} - {listing.skillNeeded}</h1>
                <p className="text-gray-600">{listing.description}</p>
            </div>
            <ChatWindow 
                messages={messages} 
                onSendMessage={handleSendMessage} 
            />
        </div>
    );
}