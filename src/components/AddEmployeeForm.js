
import React, { useState } from 'react';
import Nav from './Nav';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import {getUserToken} from '../localStorage'

function AddEmployeeForm() {

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber:'',
        department:''
      });

      const addEmployee =() =>{
        
        fetch('http://127.0.0.1:5000/employee', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${getUserToken()}`,
              'Content-Type': 'application/json'
              
            },
            body: JSON.stringify({
              name: formData['name'],
              phone: formData['phoneNumber'],
              address: formData['address'],
              department: formData['department']

            }),
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // Handle successful response
            console.log(data);
          })
          .catch(error => {
            // Handle error
            console.error('There was a problem with your fetch operation:', error);
          });
          
      }
    
      const handleChange = (e) => {
        console.log(formData);
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        console.log(formData);
      };
    


  return(
    <div>
      <Nav/>
      <Box sx={{width:'800px',height:'1000px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
        <Typography>Add Employee</Typography>
      <form style={{height:'700px',width:'600px',display:'flex',flexDirection:'column',justifyContent:'space-around',padding:'20px',border:'2px solid black',borderRadius:'10px'}}  onSubmit={addEmployee}>
     

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            </Box>
        
            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            </Box>

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            </Box>

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            </Box>
         
            <Button style={{width:'80px',padding:'8px'}} variant="contained" color="primary" type="submit">
              Submit
            </Button>

      </form>
      </Box>
    </div>
  );
}

export default AddEmployeeForm;
