// app/components/LoginForm.js
"use client";

import { useState } from 'react';
import InputField from './InputField';
import Button from './Button';

export default function LoginForm({ onClose }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        // Handle login logic here
        console.log({ username, email });
        onClose();
    };

    return (
        <div className="p-4 bg-white rounded shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
            <InputField
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={handleSubmit}>Login</Button>
                <Button onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
