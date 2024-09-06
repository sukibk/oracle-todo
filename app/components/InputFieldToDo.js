"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

export default function InputFieldToDo({ onAdd, categories }) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');

    const containerRef = useRef(null);
    const userID = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    const handleAdd = async () => {
        if (inputValue.trim() && category && date) {
            const newTask = {
                name: inputValue,
                date: date,
                customerId: userID,
                categoryId: categories.find(cat => cat.name === category).id,
                status: "new"
            };

            try {
                const response = await axios.post('http://129.151.249.132:8080/items', newTask, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // If the request is successful, clear the inputs and refetch tasks
                if (response.status === 201) {
                    setInputValue('');
                    setCategory('');
                    setDate('');
                    setIsFocused(false);
                    onAdd();  // Instead of passing the task, simply trigger a refetch of tasks
                }
            } catch (error) {
                console.error("Failed to add task:", error);
            }
        }
    };

    const handleBlur = (e) => {
        if (containerRef.current && containerRef.current.contains(e.relatedTarget)) {
            return;
        }
        setIsFocused(false);
    };

    return (
        <div ref={containerRef} onBlur={handleBlur}>
            <motion.div
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 mb-2"
            >
                <motion.input
                    type="text"
                    placeholder="Add a new task"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <AnimatePresence>
                    {isFocused && (
                        <>
                            <motion.select
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">Select category</option>
                                {
                                    categories.map(cat => (
                                        <option value={cat.name} id={cat.id} key={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))
                                }
                            </motion.select>
                            <motion.input
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            />
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white p-2 rounded"
            >
                Add Task
            </motion.button>
        </div>
    );
}
