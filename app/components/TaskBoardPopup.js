"use client";

import { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardActions, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 3;

export default function TaskBoardPopup({ onClose, onUpdateStatus, onUpdateTask, onDeleteTask }) {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [categories, setCategories] = useState([]);
    const [pageNew, setPageNew] = useState(0);
    const [pageInProgress, setPageInProgress] = useState(0);
    const [pageDone, setPageDone] = useState(0);

    const userID = localStorage.getItem('userId');
    const token = localStorage.getItem('jwt');

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`http://129.151.249.132:8080/items/user/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(oldTasks => response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            toast.error("Failed to fetch tasks.");
        }
    };

    useEffect(() => {


        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://129.151.249.132:8080/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to fetch categories.");
            }
        };

        if (userID && token) {
            fetchTasks();
            fetchCategories();
        }
    }, [userID, token]);

    useEffect(() => {
        if (paginateTasks('new', pageNew).length === 0 && pageNew > 0) {
            setPageNew(pageNew - 1);
        }
        if (paginateTasks('in progress', pageInProgress).length === 0 && pageInProgress > 0) {
            setPageInProgress(pageInProgress - 1);
        }
        if (paginateTasks('done', pageDone).length === 0 && pageDone > 0) {
            setPageDone(pageDone - 1);
        }
    }, [tasks]);

    const handleStatusChange = async (task, status) => {
        try {
            const updatedTask = { ...task, status };
            await axios.put(`http://129.151.249.132:8080/items/status`, updatedTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchTasks(); // Refresh the task list to reflect the status change
            onUpdateStatus(updatedTask, status);
            toast.success(`Task moved to ${status}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to update status.");
        }
    };

    const handleEditClick = (task) => {
        // Set the current date as default if no date is provided
        const currentDate = new Date().toISOString().substring(0, 10);
        setEditingTask({ ...task, date: currentDate })
    };

    const handleEditClose = () => {
        setEditingTask(null);
    };

    const handleEditSave = async () => {
        try {
            await axios.put(`http://129.151.249.132:8080/items`, editingTask, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchTasks(); // Refresh the task list to reflect the changes
            onUpdateTask(editingTask);
            handleEditClose()
        } catch (error) {
            console.error("Failed to update task:", error);
            toast.error("Failed to update task.");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://129.151.249.132:8080/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchTasks();
            onDeleteTask(id);
            onClose();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const paginateTasks = (status, page) => {
        return tasks
            .filter((task) => task.status.toLowerCase() === status.toLowerCase())
            .slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
    };

    const renderTasks = (status, page, setPage) => {
        const filteredTasks = tasks.filter((task) => task.status.toLowerCase() === status.toLowerCase());
        const paginatedTasks = paginateTasks(status, page);

        return (
            <>
                {paginatedTasks.map((task) => {
                    const category = categories.find(cat => cat.id === task.categoryId);
                    const categoryColor = category ? (category.name === "Work" ? '#007bff' : category.name === "Personal" ? '#28a745' : '#ffc107') : '#ccc';

                    return (
                        <Card
                            key={task.id}
                            className="mb-4"
                            style={{
                                borderRight: `5px solid ${categoryColor}`,
                                borderRadius: '8px',
                                marginBottom: '16px',
                                width: '90%',
                                height: 'auto',
                                margin: '8px auto',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardContent className="flex-1">
                                <Typography variant="h5" component="div" style={{ fontSize: '1rem' }}>
                                    {task.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.8rem' }}>
                                    {new Date(task.date).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'flex-end' }}>
                                {status === 'new' && (
                                    <>
                                        <Button size="small" onClick={() => handleStatusChange(task, 'In Progress')}>Move to In Progress</Button>
                                        <Button size="small" onClick={() => handleEditClick(task)}>Edit</Button>
                                    </>
                                )}
                                {status === 'in progress' && (
                                    <Button size="small" onClick={() => handleStatusChange(task, 'Done')}>Move to Done</Button>
                                )}
                                {status === 'done' && (
                                    <Button size="small" onClick={() => {
                                        handleDelete(task.id)
                                    }}>Delete</Button>
                                )}
                            </CardActions>
                        </Card>
                    );
                })}
                {filteredTasks.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-center mt-4">
                        <Button size="small" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</Button>
                        <Button size="small" onClick={() => setPage(page + 1)} disabled={(page + 1) * ITEMS_PER_PAGE >= filteredTasks.length}>Next</Button>
                    </div>
                )}
            </>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded p-8 shadow-lg relative"
                style={{
                    width: '90%',
                    height: '90%',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Typography variant="h4" component="h2" className="mb-12 text-center">
                    Task Board
                </Typography>
                <div style={{ marginTop: '4%' }}>
                    <Grid container spacing={4} justifyContent="center" style={{ marginBottom: '10%' }}>
                        <Grid item xs={12} md={3.3} style={{ backgroundColor: '#f0f0f0', borderRadius: '8px', padding: '16px', marginRight: '3%' }}>
                            <Typography variant="h6" component="h3" className="mb-4 text-center">
                                New
                            </Typography>
                            {renderTasks('new', pageNew, setPageNew)}
                        </Grid>
                        <Grid item xs={12} md={3.3} style={{ backgroundColor: '#dff0d8', borderRadius: '8px', padding: '16px', marginRight: '3%' }}>
                            <Typography variant="h6" component="h3" className="mb-4 text-center">
                                In Progress
                            </Typography>
                            {renderTasks('in progress', pageInProgress, setPageInProgress)}
                        </Grid>
                        <Grid item xs={12} md={3.3} style={{ backgroundColor: '#f2dede', borderRadius: '8px', padding: '16px' }}>
                            <Typography variant="h6" component="h3" className="mb-4 text-center">
                                Done
                            </Typography>
                            {renderTasks('done', pageDone, setPageDone)}
                        </Grid>
                    </Grid>
                </div>
                <div className="flex justify-end" style={{ position: 'absolute', bottom: '10%', right: '5%' }}>
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Close
                    </Button>
                </div>

                <Dialog open={!!editingTask} onClose={handleEditClose}>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Task"
                            type="text"
                            fullWidth
                            name="name"
                            value={editingTask?.name || ''}
                            onChange={handleEditChange}
                        />
                        <TextField
                            margin="dense"
                            label="Date"
                            type="date"
                            fullWidth
                            name="date"
                            value={editingTask?.date || new Date().toISOString().substring(0, 10)} // Default to current date
                            onChange={handleEditChange}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="dense"
                            label="Category"
                            select
                            fullWidth
                            name="categoryId"
                            value={editingTask?.categoryId || ''}
                            onChange={handleEditChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleEditSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </motion.div>
    );
}
