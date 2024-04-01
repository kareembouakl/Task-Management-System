import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';

import Nav from './Nav'
import { Link } from 'react-router-dom';
const Home = () => {
  



  return (
    <div>
      <Nav/>
    
    <Box sx={{height:'700px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <Paper style={{width:'500px'}}>
        <MenuList>
          <Link to='/addemp' style={{textDecoration: 'none', color: 'inherit'}}>
          <MenuItem>
            <ListItemText>1. Add An Employee</ListItemText>
            
          </MenuItem>
          </Link>
          <Link to='/addtask' style={{textDecoration: 'none', color: 'inherit'}}>
          <MenuItem>
            <ListItemText>2. Add Task</ListItemText>
            
          </MenuItem>
          </Link>
          <Link to='/assigntask' style={{textDecoration: 'none', color: 'inherit'}}>
          <MenuItem>
            <ListItemText>3. Assign Task To An Employee</ListItemText>
          
          </MenuItem>
          </Link>
          <MenuItem>
            <ListItemText>4. Employee Task Progress</ListItemText>
            
          </MenuItem>
          <MenuItem>
            <ListItemText>5. Print Employee Report</ListItemText>
          
          </MenuItem>
 
        </MenuList>
        </Paper>
    </Box>
    </div>
  );
};

export default Home;
