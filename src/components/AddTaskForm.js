import React, { useState, useEffect, useCallback } from 'react';
import Nav from './Nav';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";

const SERVER_URL = "http://127.0.0.1:5000";

function AddTaskForm() {
  const [employees, setEmployees] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

    const [formData, setFormData] = useState({
        name:'',
        deadline: '',
        commit: '',
        percentage:'',
        employee:'',
      });

      const addTask =() =>{
        
        fetch(`http://127.0.0.1:5000/employee/${selectedEmployee['id']}/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify({
              task: formData['name'],
              deadline: formData['deadline'],
              commit: formData['commit'],
              percentage: formData['percentage'],
              employee: formData['employee'],
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
        
        employees.forEach( (e) => { if (e["employee_name"] === formData['employee']) {setSelectedEmployee(e);} } );
        console.log("here");
        console.log(selectedEmployee);
      };


      
    const fetchEmployees = useCallback(() => {
      fetch(`${SERVER_URL}/employee`, {
          headers: {
              Authorization: `bearer ${getUserToken()}`,
          },
      })
          .then((response) => response.json())
          .then((e) => setEmployees(e));
  }, [getUserToken()]);
  useEffect(() => {
      const getEmployees = async () => {
          try {
              if (getUserToken()) {
                  await fetchEmployees();
              }
          } catch (error) {
              console.error("Failed to fetch employees:", error);
          }
      };

      getEmployees();
  }, [fetchEmployees, getUserToken()]);



  useEffect(() => {
      if (getUserToken()) {
          fetchEmployees();
      }
  }, [fetchEmployees]);

  useEffect(() => {
      const eN = employees.map(e => e["employee_name"]);
      setEmployeeNames(eN);
  }, [employees]);
    



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

            <Box sx={{height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
            <TextField
              fullWidth
              label="Employee"
              name="employee"
              value={formData.employee}
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
