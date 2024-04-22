import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Box, Button, Typography, TextField, IconButton, Alert } from '@mui/material';
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

    useEffect(() => {
        const fetchEmployeesAndTasks = async () => {
            try {
                const empRes = await fetch(`${SERVER_URL}/employees`);
                const taskRes = await fetch(`${SERVER_URL}/tasks`);
                const empData = await empRes.json();
                const taskData = await taskRes.json();
                console.log('Employees:', empData); 
                console.log('Tasks:', taskData);   
                setEmployees(empData);
                setTasks(taskData);
            } catch (error) {
                setError('Failed to fetch data');
                console.error(error);
            }
        };
        fetchEmployeesAndTasks();
    }, []);

    const handleChangeTask = (event) => {
        setSelectedTask(event.target.value);
    };

    const handleAddAssignment = () => {
        setAssignments([...assignments, { employee_id: '', assigned_percentage: 0 }]);
    };

    const handleRemoveAssignment = (index) => {
        const newAssignments = [...assignments];
        newAssignments.splice(index, 1);
        setAssignments(newAssignments);
    };

    const handleAssignmentChange = (index, field, value) => {
        const updatedAssignments = assignments.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setAssignments(updatedAssignments);
    };

    const assign = async () => {
        if (!selectedTask || assignments.some(a => !a.employee_id || a.assigned_percentage === 0)) {
            setError('Please select a task and complete all assignment fields');
            return;
        }
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
            setError('');
            alert('Task assigned successfully!');
            setAssignments([]);
        } catch (error) {
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
                    {tasks.map((task) => (
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
                                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                            ))}
                        </Select>
                        <TextField
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            value={assignment.assigned_percentage}
                            onChange={(e) => handleAssignmentChange(index, 'assigned_percentage', e.target.value)}
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
