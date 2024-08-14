"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import InputFieldToDo from './InputFieldToDo';
import TodoItem from './TodoItem';
import TaskBoardPopup from './TaskBoardPopup';
import { Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


const ITEMS_PER_PAGE = 6;

export default function TodoLayout() {
    const { isLoggedIn } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [showTaskBoard, setShowTaskBoard] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

    const [userID, setUserID] = useState(null);
    const [token, setToken] = useState(null);

    const fetchTasks = async () => {
        if (!userID || !token) return;
        try {
            const response = await axios.get(`http://localhost:8080/items/user/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    useEffect(() => {

        if (typeof window !== "undefined") {
            const storedUserID = localStorage.getItem('userId');
            const storedToken = localStorage.getItem('jwt');
            setUserID(storedUserID);
            setToken(storedToken);
        }

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        if (userID && token) {
            fetchTasks();
            fetchCategories();
        }
    }, [userID, token]);

    const handleAddTask = () => {
        fetchTasks();  // Simply refetch the tasks after a  one is added
        toast.success('Task added successfully!');
    };

    const handleUpdateTask = (updatedTask) => {
        const updatedTasks = tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        fetchTasks();  // Refetch tasks to ensure the latest data is shown
        toast.success('Task updated successfully!');
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
        fetchTasks();  // Refetch tasks to ensure the latest data is shown
        toast.success('Task deleted successfully!');
    };


    const handleUpdateStatus = (task, status) => {
        const updatedTasks = tasks.map((t) =>
            t.id === task.id ? { ...t, status } : t
        );
        setTasks(updatedTasks);
    };

    const paginateTasks = (page) => {
        return tasks.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
    };

    const paginatedTasks = paginateTasks(currentPage);

    const handleInputFocus = () => {
        if (!isLoggedIn) {
            setIsLoginPromptOpen(true);
        }
    };

    const handleLoginPromptClose = () => {
        setIsLoginPromptOpen(false);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">To-Do List</h2>
            {isLoggedIn ? (
                <>
                    <InputFieldToDo onAdd={handleAddTask} categories={categories} />
                    <div className="mt-6"></div>
                    <ul>
                        <AnimatePresence>
                            <div>
                                {paginatedTasks.map(({ categoryId, customerId, date, id, name, status }) => {
                                    // Define the conditional variable
                                    const conditional = categoryId === 1 ? "Work" : categoryId === 2 ? "Personal" : "Others";

                                    return (
                                        <TodoItem
                                            key={id}
                                            id={id}
                                            task={name}
                                            category={conditional} // Use the conditional variable
                                            date={date}
                                            status={status}
                                            onDelete={() => handleDeleteTask(id)}
                                            onUpdate={handleUpdateTask}
                                            isEditing={editingTaskId === id}
                                            onEdit={(id) => setEditingTaskId(id)}
                                            categories={categories}
                                        />
                                    );
                                })}
                            </div>
                        </AnimatePresence>
                    </ul>
                    {tasks.length > ITEMS_PER_PAGE && (
                        <div className="flex justify-center mt-4">
                            <Button size="small" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
                                Previous
                            </Button>
                            <Button size="small" onClick={() => setCurrentPage(currentPage + 1)} disabled={(currentPage + 1) * ITEMS_PER_PAGE >= tasks.length}>
                                Next
                            </Button>
                        </div>
                    )}
                    {tasks.length > 0 && (
                        <Button variant="contained" color="primary" onClick={() => setShowTaskBoard(true)} className="mt-4">
                            Open Task Board
                        </Button>
                    )}
                </>
            ) : (
                <p className="text-center text-red-500">Please log in to add tasks and see your to-do list.</p>
            )}
            {showTaskBoard && (
                <TaskBoardPopup
                    tasks={tasks}
                    categories={categories}
                    onClose={() => setShowTaskBoard(false)}
                    onUpdateStatus={handleUpdateStatus}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                />
            )}

            {isLoginPromptOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-2xl mb-4">Login Required</h2>
                        <p className="mb-4">You must be logged in to add tasks.</p>
                        <div className="flex justify-end">
                            <Button variant="contained" color="primary" href="/login" className="mr-2">
                                Login
                            </Button>
                            <Button variant="contained" onClick={handleLoginPromptClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
