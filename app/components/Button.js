// app/components/Button.js
"use client";

import { motion } from 'framer-motion';

export default function Button({ onClick, children }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="bg-blue-600 text-white p-2 rounded"
        >
            {children}
        </motion.button>
    );
}
