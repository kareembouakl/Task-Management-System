import React from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import Inbox from './Inbox';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TimelineIcon from '@mui/icons-material/Timeline';
import MatchScoreIcon from '@mui/icons-material/Score'; 
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';




const Home = () => {
  const menuItems = [
    { name: "Add An Employee", path: "/addemp", icon: <PersonAddIcon /> },
    { name: "Add Task", path: "/addtask", icon: <AddTaskIcon /> },
    { name: "Assign Task To An Employee", path: "/assigntask", icon: <AssignmentIndIcon /> },
    { name: "Employee Task Progress", path: "/taskprogress", icon: <TimelineIcon /> },
    { name: "Skill Matching", path: "/skillmatching", icon: <MatchScoreIcon /> },
    { name: "Carpooling", path: "/carpooling", icon: <DirectionsCarFilledIcon /> },
    { name: "Payroll", path: "/payroll", icon: <MonetizationOnIcon /> }
  ];

  return (
    <div>
      <Nav/>
      <Box sx={{
        height: '100vh', // Use the full height of the screen
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5', // Soft background color
      }}>
        <Paper elevation={3} sx={{ width: 600, overflow: 'hidden' }}>
          {menuItems.map((item, index) => (
            <Link to={item.path} style={{ textDecoration: 'none' }} key={index}>
              <Card sx={{ display: 'flex', margin: 2, '&:hover': { boxShadow: 6 } }}>
                <CardActionArea sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
                    <Box sx={{ marginRight: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" color="text.primary">
                      {item.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Paper>
      </Box>
    </div>
  );
};

export default Home;
