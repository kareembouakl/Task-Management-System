
import React, { useState } from 'react';
import Nav from './Nav';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

function AddEmployeeForm() {

    const [formData, setFormData] = useState({
        id:'',
        name: '',
        address: '',
        phoneNumber:'',
        department:'',
        managerID:''
      });

      const addEmployee =() =>{
        
        fetch('https:localhost:5000/employee', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
              name: formData['name'],
              phone: formData['phoneNumber'],
              address: formData['address'],
              department: formData['department'],
              // Add other fields as needed
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
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
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
              label="Employee ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
            </Box>

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

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Manager ID"
              name="managerID"
              value={formData.managerID}
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
