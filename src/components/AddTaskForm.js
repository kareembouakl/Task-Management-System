import React, { useState, useEffect, useCallback } from 'react';
import Nav from './Nav';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { getUserToken } from "../localStorage";

const SERVER_URL = "http://127.0.0.1:5000";

function AddTaskForm() {
    const [formData, setFormData] = useState({
        title: '',
        skills_required: ''
    });
    const [errors, setErrors] = useState([]);

    const addTask = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const skillsArray = formData.skills_required.split(',').map(skill => skill.trim());
        
        fetch(`${SERVER_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getUserToken()}`
            },
            body: JSON.stringify({
                title: formData.title,
                skills_required: skillsArray
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            setFormData({ title: '', skills_required: '' }); // Reset form on successful addition
            setErrors([]);
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            setErrors([error.message]);
        });
    };

    const validateForm = () => {
        let errorMessages = [];
        if (!formData.title.trim()) errorMessages.push("Title is required.");
        if (!formData.skills_required.trim()) errorMessages.push("Skills are required.");
        setErrors(errorMessages);
        return errorMessages.length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div>
            <Nav/>
            <Box sx={{ width: '800px', height: '1000px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6">Add Task</Typography>
                {errors.map((error, index) => (
                    <Alert key={index} severity="error">{error}</Alert>
                ))}
                <form onSubmit={addTask} style={{ height: '500px', width: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '20px', border: '2px solid black', borderRadius: '10px' }}>
                    <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} />
                    <TextField fullWidth label="Skills Required (comma-separated)" name="skills_required" value={formData.skills_required} onChange={handleChange} />
                    <Button style={{ width: '80px', padding: '8px' }} variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            </Box>
        </div>
    );
}

export default AddTaskForm;
