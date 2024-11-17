import { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            router.push('/'); // Redirect to home after successful login
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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
            <button type="submit">Login</button>
        </form>
    );
}