import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../axiosInstance';
import Link from 'next/link';

export default function ListingDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [listing, setListing] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                try {
                    const response = await axiosInstance.get(`/listings/${id}`);
                    setListing(response.data);
                } catch (error) {
                    console.error('Error fetching listing:', error);
                }
            };

            fetchListing();
        }
    }, [id]);

    if (!listing) return <div>Loading...</div>;

    return (
        <div>
            <h1>{listing.skillOffered} - {listing.skillNeeded}</h1>
            <p>{listing.description}</p>
            <Link href={`/chat/listings/${listing.id}`}>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Chat with Owner
                </button>
            </Link>
        </div>
    );
}