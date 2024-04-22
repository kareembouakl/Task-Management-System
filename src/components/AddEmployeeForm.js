import React, { useState } from 'react';
import Nav from './Nav';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { getUserToken } from '../localStorage';

function AddEmployeeForm() {
    const initialFormData = {
        name: '',
        salary: '',
        address: '',
        skills: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState([]);

    const validateForm = () => {
        let errorMessages = [];
        if (!formData.name.trim()) errorMessages.push("Name is required.");
        if (!formData.salary.trim()) errorMessages.push("Salary is required.");
        if (!formData.address.trim()) errorMessages.push("Address is required.");
        if (!formData.skills.trim()) errorMessages.push("Skills are required.");
        setErrors(errorMessages);
        return errorMessages.length === 0; // Return true if no errors
    };

    const addEmployee = (event) => {
        event.preventDefault();
        if (!validateForm()) return; // Stop submission if validation fails

        const skillsArray = formData.skills.split(',').map(skill => skill.trim());
        fetch('http://127.0.0.1:5000/employees', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getUserToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                salary: parseFloat(formData.salary),
                address: formData.address,
                skills: skillsArray,
                days_off: 12  // Set days_off to 12 as it's required by the backend but not editable by the user
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Employee added:', data);
            setErrors([]); // Clear errors on successful operation
            setFormData(initialFormData); // Reset the form data to initial values
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            setErrors([error.message]);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        console.log(formData);
      };
    


  return(
    <div>
      <Nav/>
      <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
      <Box sx={{width:'600px',height:'1000px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
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
      </Box>
    </div>
  );
}

export default AddEmployeeForm;