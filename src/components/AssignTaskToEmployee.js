import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, InputLabel, MenuItem, Select, TextField, Typography, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Nav from './Nav';

const SERVER_URL = "http://127.0.0.1:5000";

function AssignTaskToEmployee() {
    const [employees, setEmployees] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');
    const [availableTasks, setAvailableTasks] = useState([]);

    useEffect(() => {
        fetchEmployeesAndTasks();
    }, []);

    const fetchEmployeesAndTasks = async () => {
        try {
            const taskRes = await fetch(`${SERVER_URL}/tasks`);
            const taskData = await taskRes.json();
            console.log('Tasks fetched:', taskData);

            const empRes = await fetch(`${SERVER_URL}/employees`);
            const empData = await empRes.json();
            console.log('Employees fetched:', empData);

            const tasksByEmployee = await Promise.all(
                empData.map(async (employee) => {
                    const response = await fetch(`${SERVER_URL}/employee_tasks/${employee.id}`);
                    const data = await response.json();
                    console.log(`Tasks for employee ${employee.id}:`, data);
                    return data;
                })
            );

            const assignedTaskIds = new Set();
            tasksByEmployee.flat().forEach(task => assignedTaskIds.add(task.task_id));
            console.log('Assigned Task IDs:', assignedTaskIds);

            const available = taskData.filter(task => !assignedTaskIds.has(task.id));
            console.log('Available tasks:', available);
            setAvailableTasks(available);
            setEmployees(empData);
            setTasks(taskData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch data');
        }
    };

    const handleChangeTask = (event) => {
        console.log(`Task selected: ${event.target.value}`);
        setSelectedTask(event.target.value);
    };

    const handleAddAssignment = () => {
        console.log('Adding new assignment...');
        setAssignments([...assignments, { employee_id: '', assigned_percentage: 0 }]);
    };

    const handleRemoveAssignment = (index) => {
        console.log(`Removing assignment at index ${index}`);
        const newAssignments = [...assignments];
        newAssignments.splice(index, 1);
        setAssignments(newAssignments);
    };

    const handleAssignmentChange = (index, field, value) => {
        console.log(`Updating assignment at index ${index}, field ${field}, value ${value}`);
        if (field === 'assigned_percentage') {
            const totalOtherAssigned = assignments.reduce((acc, curr, idx) => idx === index ? acc : acc + Number(curr.assigned_percentage), 0);
            const maxAssignable = 100 - totalOtherAssigned;
            value = value > maxAssignable ? maxAssignable : value;
        }

        const updatedAssignments = assignments.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setAssignments(updatedAssignments);
    };

    const assign = async () => {
        if (!selectedTask || assignments.some(a => !a.employee_id || a.assigned_percentage === 0)) {
            console.log('Validation failed: task or assignments not properly set.');
            setError('Please select a task and complete all assignment fields');
            return;
        }
        console.log('Sending assignments to server:', { task_id: selectedTask, assignments });
        try {
            const response = await fetch(`${SERVER_URL}/assign_task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_id: selectedTask,
                    assignments
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to assign task');
            }
            console.log('Assignment successful:', data);
            setError('');
            alert('Task assigned successfully!');
            setAssignments([]);
        } catch (error) {
            console.error('Error during assignment:', error);
            setError(error.message);
        }
    };

    return (
        <div>
            <Nav />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="div" sx={{ flexGrow: 1, justifyContent: 'center', margin: 5 }}>
                    Assign Task to Employees
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <InputLabel id="select-task-label" sx={{ fontSize: 24 }}>Select a task</InputLabel>
                <Select
                    labelId="select-task-label"
                    id="select-task"
                    value={selectedTask}
                    onChange={handleChangeTask}
                    sx={{ width: 300, marginBottom: 2 }}
                >
                    {availableTasks.map((task) => (
                        <MenuItem key={task.id} value={task.id}>{task.title}</MenuItem>
                    ))}
                </Select>
                {assignments.map((assignment, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', margin: 1 }}>
                        <Select
                            value={assignment.employee_id}
                            onChange={(e) => handleAssignmentChange(index, 'employee_id', e.target.value)}
                            sx={{ width: 180, marginRight: 1 }}
                        >
                            {employees.map((emp) => (
                                <MenuItem 
                                    key={emp.id} 
                                    value={emp.id}
                                    disabled={assignments.some(a => a.employee_id === emp.id && index !== assignments.indexOf(a))}
                                >
                                    {emp.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            value={assignment.assigned_percentage}
                            onChange={(e) => handleAssignmentChange(index, 'assigned_percentage', Number(e.target.value))}
                            sx={{ width: 100 }}
                        />
                        <IconButton onClick={() => handleRemoveAssignment(index)}>
                            <RemoveCircleOutlineIcon color="error" />
                        </IconButton>
                    </Box>
                ))}
                <Button onClick={handleAddAssignment} startIcon={<AddCircleOutlineIcon />} sx={{ marginBottom: 2 }}>
                    Add Assignment
                </Button>
                <Button
                    onClick={assign}
                    sx={{ backgroundColor: 'teal', color: 'white', margin: 2 }}
                >
                    Assign Task
                </Button>
            </Box>
        </div>
    );
}

export default AssignTaskToEmployee;
