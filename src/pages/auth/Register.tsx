import React, { useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register(): JSX.Element {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [confirm, setConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (!res.ok) throw new Error(`Registration failed: ${res.status}`);
            // const data = await res.json();
            // e.g. store token: localStorage.setItem('token', data.token);
            navigate('/login'); // redirect to login after successful registration
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-gray-600 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border text-gray-600 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-300"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white font-medium px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
