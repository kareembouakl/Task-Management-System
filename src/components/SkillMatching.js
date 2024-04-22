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
            setTasks(tasksData);

            const empRes = await fetch(`${SERVER_URL}/employees`);
            const employeesData = await empRes.json();
            const employeesWithTasks = await Promise.all(
                employeesData.map(async emp => {
                    const tasksRes = await fetch(`${SERVER_URL}/employees/${emp.id}/tasks`);
                    const tasks = await tasksRes.json();
                    return { ...emp, tasks };
                })
            );
            setEmployees(employeesWithTasks);
        } catch (error) {
            setError('Failed to fetch data');
            console.error(error);
        }
    };

    const generateAssignments = () => {
        // Sort employees by their number of tasks (ascending)
        const sortedEmployees = employees.sort((a, b) => a.tasks.length - b.tasks.length);

        const newAssignments = tasks.map(task => {
            // First try to find an employee with no tasks
            let matchedEmployee = sortedEmployees.find(emp => emp.tasks.length === 0 && emp.skills.some(skill => task.skills_required.includes(skill)));
            if (!matchedEmployee) {
                // If no available employee found, try to find any suitable employee
                matchedEmployee = sortedEmployees.find(emp => emp.skills.some(skill => task.skills_required.includes(skill)));
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
