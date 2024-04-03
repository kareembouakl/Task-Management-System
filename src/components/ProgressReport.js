import React, { useState, useEffect, useCallback } from 'react'
import { Typography, Paper, List, ListItem, ListItemText, Box, MenuItem, InputLabel, Select } from '@mui/material';

import { getUserToken } from '../localStorage';
import Nav from './Nav';
// import SERVER_URL from '../App'
const SERVER_URL = "http://127.0.0.1:5000";



function ProgressReport() {
    const [employees, setEmployees] = useState([]);
    const [employeeNames, setEmployeeNames] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [tasks, setTasks] = useState([]);


    const handleChangeEmp = (event) => {
        fetchEmployees();
        const name = event.target.value;
        employees.forEach( (e) => { if (e["employee_name"] == name) {setSelectedEmployee(e);} } );
        fetchEmployeeTasks();
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

    const fetchEmployeeTasks = useCallback(() => {
        fetch(`${SERVER_URL}/employee/${selectedEmployee["id"]}/task`, {
            method: 'GET',
            headers: {
                Authorization: `bearer ${getUserToken()}`,
            },
        })
            .then((response) => response.json())
            .then((tasks) => setTasks(tasks));
    }, [getUserToken()]);



    useEffect(() => {
        if (getUserToken()) {
            fetchEmployees();
        }
    }, [fetchEmployees]);

    useEffect(() => {
        const eN = employees.map(e => e["employee_name"]);
        setEmployeeNames(eN);
    }, [employees]);

  return (
    <div>
        <Nav />
        <div>
            <InputLabel 
                id="select-employee-label"
                sx={{ fontSize: 24 }}
                >Select an employee</InputLabel>
            <Select
                labelId="select-employee-label"
                id="select-employee"
                value={selectedEmployee["employee_name"]}
                label="Select an employee"
                onChange={handleChangeEmp}
                
                sx={{ width: 200 }}
            >
                {employeeNames.map((e, index) => (
                    <MenuItem key={index} value={e}>{e}</MenuItem>
                ))}
            </Select>
        </div>
        <Typography variant="h4" gutterBottom>
            Employee Progress Report
        </Typography>
        <Typography variant="body1"><strong>Phone Number:</strong> { selectedEmployee["employee_phone"] }</Typography>
        <Box>
            <Typography variant="h5">Tasks:</Typography>
            <List>
            {tasks.map((task, index) => (
                <Box sx={{display:'flex',flexDirection:'column'}}>
                    {/* <ListItemText primary={task["task_name"]} secondary={`Progress: ${task["task_percentage"]}`}     
                     /> */}
                    <Typography variant="h6">Task: {task["task_name"]}</Typography>
                    <Typography variant="h7">Last commit: {task["task_commit"]}</Typography>
                    <Typography variant="h7">Progress: {task["task_percentage"]}</Typography>
                    <Typography variant="h7">Deadline: {task["task_deadline"]}</Typography>
                </Box>
                
            ))}
            </List>
        </Box>
    </div>
  )
}

export default ProgressReport