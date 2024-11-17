import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useRouter } from 'next/router';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/register', {
                name,
                email,
                password,
            });
            router.push('/login'); // Redirect to login after successful registration
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
        </form>
    );
}