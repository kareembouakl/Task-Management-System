import React, { useState,useEffect } from 'react';
import './Inbox.css'; // Import CSS file for sidebar styles
import { Box,Drawer,Stack, IconButton, Typography, Alert } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import the notifications icon

const Inbox = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const SERVER_URL = "http://127.0.0.1:5000";

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
   
    fetchNotifications();
  };

  const fetchNotifications = async () => {
    try {
        const requestOptions = {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
          
            },
            body: JSON.stringify({ 
              subject: 'Your subject here',
              message_content: 'Your message content here'
      
            })
          };
      const r = await fetch(`${SERVER_URL}/messages`,requestOptions);

      const response = await fetch(`${SERVER_URL}/messages`);
      const data = await response.json();
  
      // Filter out duplicate messages based on message ID
      const uniqueNotifications = data.filter((notification, index, self) =>
        index === self.findIndex((t) => (
          t.message_content=== notification.message_content
        ))
      );
  
      setNotifications(uniqueNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };




  return (
    <div>
      {!showSidebar && (
        <IconButton onClick={toggleSidebar} className='sidebar-toggle-btn' color="inherit">
          <NotificationsIcon />
        </IconButton>
      )}
      <Drawer
        anchor="left"
        open={showSidebar}
        onClose={toggleSidebar}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{ width: 350 }}
        >
          <Box>
            <Typography variant="h6" style={{ color: 'white', backgroundColor: 'teal', margin: '0', padding: '5%' }}>
              Notifications
            </Typography>
          </Box>
          <Stack spacing={0}>
            {notifications.map((notification, index) => (
              <Box sx={{ backgroundColor: 'gray', padding: '5%', borderBottom: 'black 1px solid' }} key={index}>
                <Typography>{notification.subject}</Typography>
                <Typography>{notification.message_content}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </div>
  );
};

export default Inbox;
