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

    //const employeeNames = () => { forEach (e in employees) {employeeNames.push(e["name"]); } }; //EXTRACT NAMES
    
    //const employeeNames = employees.forEach( (e) => {employeeNames.push(e["employee_name"]); console.log(e["employee_name"]);});

    useEffect(()=>{
        fetchEmployees();
        console.log(employees[0]);

        // setEmployeeNames( employees.forEach( (e) => {employeeNames.push(e["employee_name"]); console.log(e["employee_name"]);}); );
        //setEmployeeNames(employees.map(e => e["employee_name"]));
        const eN = [];
        employees.forEach( (e) => {eN.push(e["employee_name"]); });
        setEmployeeNames(eN);

        console.log(employeeNames);
        fetchEmployees();
    },[])

    const handleChangeEmp = (event) => {
        setSelectedEmployee(event.target.value);
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
        fetchEmployees(); 
    }, [fetchEmployees]);


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
                value={selectedEmployee}
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
        <Typography variant="body1"><strong>Date of Birth:</strong> { /* DOB */ }</Typography>
        <Typography variant="body1"><strong>Task:</strong> { /* TASK(S?) */ }</Typography>
        <Typography variant="body1"><strong>Progress:</strong> { /* PROGRESS */ }%</Typography>
        {/* <Box>
            <Typography variant="h5">Tasks:</Typography>
            <List>
            {employee.tasks.map((task, index) => (
                <ListItem key={index} divider>
                <ListItemText primary={task.name} secondary={`Status: ${task.status}`} />
                </ListItem>
            ))}
            </List>
        </Box> */}
    </div>
  )
}

export default ProgressReport