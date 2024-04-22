import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import Nav from './Nav';

const SERVER_URL = "http://127.0.0.1:5000";

function AutoAssignTasks() {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasksAndEmployees();
    }, []);

    const fetchTasksAndEmployees = async () => {
        try {
            const tasksRes = await fetch(`${SERVER_URL}/tasks`);
            const tasksData = await tasksRes.json();
            const empRes = await fetch(`${SERVER_URL}/employees`);
            const employeesData = await empRes.json();

            const employeesWithTasks = await Promise.all(
                employeesData.map(async emp => {
                    const tasksRes = await fetch(`${SERVER_URL}/employee_tasks/${emp.id}`);
                    const tasks = await tasksRes.json();
                    return { ...emp, tasks };
                })
            );

            setTasks(tasksData);
            setEmployees(employeesWithTasks);
            console.log("Tasks loaded:", tasksData);
            console.log("Employees loaded with their tasks:", employeesWithTasks);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to fetch data');
        }
    };

    const generateAssignments = () => {
        let availableTasks = tasks.filter(task => 
            !employees.some(emp => 
                emp.tasks.some(t => t.task_id === task.id)));

        const sortedEmployees = [...employees].sort((a, b) => a.tasks.length - b.tasks.length);

        const newAssignments = availableTasks.map(task => {
            let matchedEmployee = sortedEmployees.find(emp => 
                emp.skills.some(skill => task.skills_required.includes(skill)) && 
                emp.tasks.every(t => t.task_id !== task.id));

            if (!matchedEmployee) {
                matchedEmployee = sortedEmployees.find(emp => 
                    emp.skills.some(skill => task.skills_required.includes(skill)));
            }

            return {
                ...task,
                assignedTo: matchedEmployee ? matchedEmployee.name : "No suitable employee found"
            };
        });
        setAssignments(newAssignments);
    };

    return (
        <div>
            <Nav />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>Auto Assign Tasks</Typography>
                <Button variant="contained" color="primary" onClick={generateAssignments} sx={{ mb: 2 }}>
                    Generate
                </Button>
                {error && <Alert severity="error">{error}</Alert>}
                {assignments.map((assignment, index) => (
                    <div key={index}>
                        Task: {assignment.title} - Assign to: {assignment.assignedTo}
                    </div>
                ))}
            </Box>
        </div>
    );
}

export default AutoAssignTasks;
