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
import { Link } from 'react-router-dom';








const Nav = () => {
  
  
    return (
    <div>
        <AppBar sx={{ backgroundColor: 'blue' }} position="static">
        <Toolbar>
          <Link style={{textDecoration: 'none', color:'white'}} to='/'>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          </Link>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              {/* Add an icon here */}
            </IconButton>
            <Menu
              id="menu-appbar"
            
             
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem >Profile</MenuItem>
              <MenuItem >My account</MenuItem>
            </Menu>
          </div>

          <Box sx={{width:'200px',display:'flex',flexDirection:'row',justifyContent:'space-around',pr:'0'}}>
            <Button sx={{backgroundColor:'whitesmoke',color:'black'}}>Register</Button>
            <Button sx={{backgroundColor:'whitesmoke',color:'black'}}>Login</Button>

          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
            

            };

            export default Nav;