import React, { useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!res.ok) throw new Error(`Login failed: ${res.status}`);
            // const data = await res.json();
            // e.g. localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300  text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border text-gray-600 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
