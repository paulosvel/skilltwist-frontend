import { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
    const [listings, setListings] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axiosInstance.get('/listings');
                setListings(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    console.error('Error fetching listings:', error);
                }
            }
        };

        fetchListings();
    }, [router]);

    return (
        <div>
            <h1>Welcome to the Skill Swap Platform</h1>
            <h2>Available Listings</h2>
            <nav>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/create-listing">Create Listing</Link>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
                <Link href="/chat">Chat</Link>
            </nav>
            <ul>
                {listings.map((listing) => (
                    <li key={listing._id}>
                        <h3>{listing.skillOffered} - {listing.skillNeeded}</h3>
                        <p>{listing.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}