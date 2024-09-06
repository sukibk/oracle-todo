"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Check for the JWT token in local storage on page load
        const token = localStorage.getItem('jwt');
        if (token) {
            setIsLoggedIn(true);
            // Optionally, decode the token to get user data
            // setUserData(decodedUserData);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://129.151.249.132:8080/users/login', {
                username: username,
                password: password
            });
            if (response.status === 200) {
                const token = response.data.token;// Assuming the token is returned in the 'token' field
                const userId = response.data.id;
                localStorage.setItem('jwt', token);
                localStorage.setItem('userId', userId);
                setIsLoggedIn(true);
                // Optionally, decode the token to get user data
                // setUserData(decodedUserData);
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
