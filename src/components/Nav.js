import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Snackbar, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Inbox from './Inbox';
import UserCredentialsDialog from '../UserCredentialsDialog/UserCredentialsDialog';

const Nav = () => {
    const SERVER_URL = "http://127.0.0.1:5000";
    const States = {
        PENDING: "PENDING",
        USER_CREATION: "USER_CREATION",
        USER_LOG_IN: "USER_LOG_IN",
        USER_AUTHENTICATED: "USER_AUTHENTICATED",
    };

    const [loginRejected, setLoginRejected] = useState(false);
    const [authState, setAuthState] = useState(States.PENDING);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('login');
        setIsLoggedIn(loggedIn === "true");
    }, []);

    const login = (username, password) => {
        return fetch(`${SERVER_URL}/manager`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
            }),
        })
        .then((response) => {
            if (response.status === 403) {
                setLoginRejected(true);
            }

            if (response.status === 200) {
                setAuthState(States.USER_AUTHENTICATED);
                localStorage.setItem('login', true);
                setIsLoggedIn(true);
            }
            return response.json();
        })
        .then((body) => {
            // Handle response body if needed
        })
        .catch((error) => {
            console.error('Error during login:', error);
        });
    };

    const menuItems = [
      { name: "Add Employee", path: "/addemp" },
      { name: "Add Task", path: "/addtask" },
      { name: "Assign Task", path: "/assigntask" },
      { name: "Track Task Progress", path: "/taskprogress" },
      { name: "Task Matching", path: "/skillmatching" },
      { name: "Carpooling", path: "/carpooling" },
      { name: "Payroll", path: "/payroll" }
  ];

    return (
        <div>
            <AppBar position="static" color="primary" sx={{ backgroundColor: 'teal' }}>
                <Toolbar>
                    <Box sx={{ width: '200px' }}>
                        <Typography sx={{ textDecoration: 'none', color: 'white' }} variant="h6" component={RouterLink} to='/'>
                            Task Manager
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        {isLoggedIn && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                 {menuItems.map((item, index) => (
                                <Button 
                                    key={index} 
                                    component={RouterLink} 
                                    to={item.path}
                                    sx={{ color: 'white', marginRight: 4 }}
                                    
                                >
                                    {item.name}
                                </Button>
                            ))}
                            </Box>
                        )}
                        {!isLoggedIn && (
                            <Button onClick={() => { setAuthState(States.USER_LOG_IN) }} sx={{ color: 'black', backgroundColor: 'white' }}>
                                Login
                            </Button>
                        )}

                        {isLoggedIn && (
                            <Button
                                onClick={() => {
                                    localStorage.setItem('login', false);
                                    setAuthState(States.PENDING);
                                    window.location.reload(); // Reload the page after logout
                                }}
                                sx={{ color: 'black', backgroundColor: 'white' }}
                            >
                                Logout
                            </Button>
                        )} 
                    </Box>
                </Toolbar>
            </AppBar>
            {isLoggedIn && <Inbox />}
            <UserCredentialsDialog
                open={authState === States.USER_LOG_IN}
                title={"Login"}
                onSubmit={login}
                onClose={() => { setAuthState(States.PENDING) }}
                submitText={"Login"}
            />
            <Snackbar elevation={6} variant="filled" open={loginRejected} autoHideDuration={2000} onClose={() => setLoginRejected(false)}>
                <Alert severity="error">Wrong Username or Password</Alert>
            </Snackbar>
        </div>
    );
};

export default Nav;
