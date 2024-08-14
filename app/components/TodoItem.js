"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const categoryColors = {
    Work: 'bg-blue-500',
    Personal: 'bg-green-500',
    Others: 'bg-yellow-500',
};

export default function TodoItem({ id, task, category, date, onDelete, onUpdate, isEditing, onEdit, categories }) {
    // Initialize editDate with the provided date or the current date if not provided
    const [editTask, setEditTask] = useState(task);
    const [editCategory, setEditCategory] = useState(category);
    const [editDate, setEditDate] = useState(date ? new Date(date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));

    const token = localStorage.getItem('jwt');

    useEffect(() => {
        if (isEditing) {
            setEditTask(task);
            setEditCategory(category);
            setEditDate(date ? new Date(date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));
        }
    }, [isEditing, task, category, date]);

    const handleCancelEdit = () => {
        onEdit(null);
        setEditTask(task);
        setEditCategory(category);
        setEditDate(date ? new Date(date).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));
    };

    const handleSaveEdit = async () => {
        try {
            const updatedTask = {
                id,
                name: editTask,
                date: editDate,
                customerId: localStorage.getItem('userId'),
                categoryId: categories.find(cat => cat.name === editCategory).id,
                status: 'new'  // Or retain the current status if you're tracking it
            };

            await axios.put('http://localhost:8080/items', updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            onUpdate(updatedTask);
            onEdit(null);
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await axios.delete(`http://localhost:8080/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            onDelete();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    // Format the date to remove time for display
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <motion.li
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center bg-gray-100 p-2 rounded mb-2 relative"
        >
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${categoryColors[editCategory]}`}></div>
            {isEditing ? (
                <div className="flex items-center w-full">
                    <input
                        type="text"
                        value={editTask}
                        onChange={(e) => setEditTask(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded ml-4"
                    />
                    <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="p-2 border border-gray-300 rounded ml-2"
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded ml-2"
                    />
                    <button className="text-green-600 ml-2" onClick={handleSaveEdit}>✔️</button>
                    <button className="text-red-600 ml-2" onClick={handleCancelEdit}>❌</button>
                </div>
            ) : (
                <>
                    <div className="flex-1 ml-4 break-words" style={{ maxWidth: '60%' }} onClick={() => onEdit(id)}>
                        {task}
                    </div>
                    <div className="flex items-center space-x-2 ml-auto">
                        <span className="text-gray-500 text-sm">{formattedDate}</span>
                        <button className="text-red-600" onClick={handleDeleteTask}>Delete</button>
                    </div>
                </>
            )}
        </motion.li>
    );
}
