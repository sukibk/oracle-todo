"use client";

import { useAuth } from '../../context/AuthContext';
import { Button } from '@mui/material';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

export default function Header() {
    const { isLoggedIn, login, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerData, setRegisterData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };

    const handleRegisterClick = () => {
        setIsRegisterOpen(true);
    };

    const handleClose = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(false);
        setError('');
        clearInputs();
    };

    const clearInputs = () => {
        setUsername('');
        setPassword('');
        setRegisterData({
            username: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            handleClose();
            toast.success('Login successful!');
        } else {
            setError('Invalid credentials');
            toast.error('Login failed!');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('http://localhost:8080/users/register', {
                username: registerData.username,
                password: registerData.password,
                mail: registerData.email,
                name: registerData.name
            });
            toast.success('Registration successful! Logging in...');
            const tempUsername = registerData.username;
            const tempPassword = registerData.password;

            clearInputs();

            await login(tempUsername, tempPassword);
            handleClose();
        } catch (error) {
            setError('Registration failed');
            toast.error('Registration failed!');
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully!');
    };

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-xl">Todo App</h1>
            <nav className="flex space-x-4 ml-auto">
                {isLoggedIn ? (
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Log Out
                    </Button>
                ) : (
                    <>
                        <Button variant="contained" color="primary" onClick={handleLoginClick}>
                            Login
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleRegisterClick}>
                            Register
                        </Button>
                    </>
                )}
            </nav>

            {isLoginOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4 text-center text-black">Login</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex justify-end space-x-4">
                                <Button variant="contained" color="primary" type="submit">
                                    Login
                                </Button>
                                <Button variant="contained" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isRegisterOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4 text-center text-black">Register</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={registerData.username}
                                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={registerData.password}
                                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded text-black"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex justify-end space-x-4">
                                <Button variant="contained" color="primary" type="submit">
                                    Register
                                </Button>
                                <Button variant="contained" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
