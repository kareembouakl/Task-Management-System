import { useState, useCallback } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Box, Snackbar, Alert } from '@mui/material';
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

import UserCredentialsDialog from '../UserCredentialsDialog/UserCredentialsDialog'
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage"
//import SERVER_URL from '../App'
const SERVER_URL = "http://127.0.0.1:5000";



const Nav = () => {
    const States = {
        PENDING: "PENDING",
        USER_CREATION: "USER_CREATION",
        USER_LOG_IN: "USER_LOG_IN",
        USER_AUTHENTICATED: "USER_AUTHENTICATED",
    };

    const [userToken, setUserToken] = useState(getUserToken());
    const [authState, setAuthState] = useState(States.PENDING);



    function login(username, password) {
      return fetch(`${SERVER_URL}/authentication`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              user_name: username,
              password: password,
          }),
      })
          .then((response) => response.json())
          .then((body) => {
              setAuthState(States.USER_AUTHENTICATED);
              setUserToken(body.token);
              saveUserToken(body.token);
          }
      );
    }

    function createUser(username, password) {
      return fetch(`${SERVER_URL}/user`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
          user_name: username,
          password: password,
          }),
          }).then((response) => login(username, password));
    }

    function logout() {
      setUserToken(null);
      clearUserToken();
    }

  
    return (
      <div>
      <div>
        <AppBar sx={{ backgroundColor: 'teal' }} position="static">
        <Toolbar sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
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
            {userToken ? (
            <Button 
              sx={{backgroundColor:'whitesmoke',color:'black'}} 
              onClick={logout}
            >Logout</Button>
                      ) : ( <>
            <Button 
              sx={{backgroundColor:'whitesmoke',color:'black'}}
              onClick={() => setAuthState(States.USER_CREATION)}
            >Register</Button>
            <Button 
              sx={{backgroundColor:'whitesmoke',color:'black'}}
              onClick={() => setAuthState(States.USER_LOG_IN)}
            >Login</Button> </>
                      )}

          </Box>
        </Toolbar>
      </AppBar>
    </div>


    <UserCredentialsDialog
        open={authState === States.USER_CREATION}
        onSubmit={createUser}
        onClose={() => {setAuthState(States.PENDING);}}
        title="Register"
        submitText="Register"
    />
    <UserCredentialsDialog
        open={authState === States.USER_LOG_IN}
        onSubmit={login}
        onClose={() => {setAuthState(States.PENDING);}}
        title="Login"
        submitText="Login"
    />
    <Snackbar
        elevation={6}
        variant="filled"
        open={authState === States.USER_AUTHENTICATED}
        autoHideDuration={2000}
        onClose={() => setAuthState(States.PENDING)}
    >
        <Alert severity="success">Success</Alert>
    </Snackbar>
    </div>
  );
            

            };

            export default Nav;