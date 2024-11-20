import React, { useState } from 'react';
import Link from 'next/link';
import axiosInstance from '@/axiosInstance';


const CreateListing = () => {
    const [skillOffered, setSkillOffered] = useState('');
    const [skillNeeded, setSkillNeeded] = useState('');
    const [description, setDescription] = useState('');
    const [listings, setListings] = useState([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/listings', {
                skillOffered,
                skillNeeded,
                description,
            });
            if (response.status === 200) {
                console.log('Listing created:', response.data);
                // Clear form after successful submission
                setSkillOffered('');
                setSkillNeeded('');
                setDescription('');
            } else {
                console.error('Failed to create listing:', response);
            }
        } catch (error) {
            console.log(error);
        } 
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Skill Offered:</label>
                <input type="text" value={skillOffered} onChange={(e) => setSkillOffered(e.target.value)} required />
            </div>
            <div>
                <label>Skill Needed:</label>
                <input type="text" value={skillNeeded} onChange={(e) => setSkillNeeded(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <button type="submit">Create Listing</button>
        </form>
    );
};

export default CreateListing;