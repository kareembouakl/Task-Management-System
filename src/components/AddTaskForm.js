import React, { useState } from 'react';
import Nav from './Nav';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';

function AddTaskForm() {

    const [formData, setFormData] = useState({
        name:'',
        deadline: '',
        commit: '',
        percentage:'',
      });

      const addTask =() =>{
        
        fetch(`http://127.0.0.1:5000/employee/${formData['empID']}/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
              name: formData['name'],
              deadline: formData['deadline'],
              commit: formData['commit'],
              percentage: formData['percentage'],
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
        <Typography>Add Task</Typography>
      <form style={{height:'700px',width:'600px',display:'flex',flexDirection:'column',justifyContent:'space-around',padding:'20px',border:'2px solid black',borderRadius:'10px'}}  onSubmit={addTask}>
            
            
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
              label="Deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
            </Box>
        
            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Commit"
              name="commit"
              value={formData.commit}
              onChange={handleChange}
            />
            </Box>

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Percentage"
              name="percentage"
              value={formData.percentage}
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

export default AddTaskForm;
