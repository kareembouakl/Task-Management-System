import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Inbox from './Inbox';

const Nav = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const menuItems = [
        { name: "Add Employee", path: "/addemp" },
        { name: "Add Task", path: "/addtask" },
        { name: "Assign Task", path: "/assigntask" },
        { name: "Track Task Progress", path: "/taskprogress" },
        { name: "Task Matching", path: "/skillmatching" },
        { name: "Carpooling", path: "/carpooling" }
    ];

    return (
        <AppBar position="static" color="primary" sx={{ backgroundColor: 'teal' }}>
            <Toolbar>
                  <Typography variant="h6" component={RouterLink} to='/' sx={{ flexGrow: 1 }}>
                    <strong>Task Manager</strong>
                  </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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
                    </Box>
                <Inbox/>
            </Toolbar>
        </AppBar>
    );
};

export default Nav;
