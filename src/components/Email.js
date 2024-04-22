import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import Nav from './Nav'; // Assuming Nav is your navigation component

const SERVER_URL = "http://127.0.0.1:5000";

function Email() {
    const [formData, setFormData] = useState({
        subject: '',
        recipient: '',
        content: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.subject || !formData.recipient || !formData.content) {
            setError('All fields are required.');
            return;
        }
        setError('');
        try {
            const response = await fetch(`${SERVER_URL}/send-mail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send email');
            }
            setMessage('Email sent successfully!');
            setFormData({ subject: '', recipient: '', content: '' }); // Clear form
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Nav />
            <Box sx={{ mt: 2, mx: 'auto', maxWidth: 500 }}>
                <Typography variant="h4" gutterBottom>Send Email</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {message && <Alert severity="success">{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Subject"
                        name="subject"
                        fullWidth
                        margin="normal"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Recipient"
                        name="recipient"
                        fullWidth
                        margin="normal"
                        value={formData.recipient}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Content"
                        name="content"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={formData.content}
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Send Email
                    </Button>
                </form>
            </Box>
        </div>
    );
}

export default Email;
