// app/layout.js
import './globals.css';
import { ToastContainer} from 'react-toastify';
import Header from './components/Header'
import InputFieldToDo from "./components/InputFieldToDo";
import {AuthProvider} from "@/context/AuthContext";



export default function RootLayout({ children }) {

    return (
        <html lang="en">
        <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
        <Header />
        <main className="p-4">{children}</main></AuthProvider>
        </body>
        <ToastContainer />
        </html>
    );
}
