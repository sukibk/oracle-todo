// app/components/RegisterForm.js
"use client";

import { useState } from 'react';
import InputField from './InputField';
import Button from './Button';

export default function RegisterForm({ onClose }) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [requirements, setRequirements] = useState({
        length: false,
        specialChar: false,
        match: false,
    });

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setRequirements({
            length: value.length >= 8,
            specialChar: /[!@#$%^&*]/.test(value),
            match: value === confirmPassword,
        });
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setRequirements((prev) => ({
            ...prev,
            match: value === password,
        }));
    };

    const handleSubmit = () => {
        if (requirements.length && requirements.specialChar && requirements.match) {
            // Handle register logic here
            console.log({ username, name, email, password });
            onClose();
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">Register</h2>
            <InputField
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
            />
            <InputField
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
            />
            <div className="mb-2">
                <span className={requirements.length ? 'text-green-500' : 'text-red-500'}>At least 8 characters</span><br />
                <span className={requirements.specialChar ? 'text-green-500' : 'text-red-500'}>At least one special character</span><br />
                <span className={requirements.match ? 'text-green-500' : 'text-red-500'}>Passwords match</span>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={handleSubmit}>Register</Button>
                <Button onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
