import React, { useState, useEffect, useCallback } from 'react'
import { Typography, Paper, List, ListItem, ListItemText, Box, MenuItem, InputLabel, Select, Table, TableCell, TableHead, TableRow, TableBody } from '@mui/material';

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
       
        <Box sx={{height:'200px',marginLeft:'2%'}}> 
            <InputLabel 
                id="select-employee-label"
                sx={{ fontSize: 24, height:'100px', display:'flex',flexDirection:'column',justifyContent:'center' }}
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
           
   
        <Typography variant="h4" gutterBottom sx={{paddingTop:'2%'}}>
            Employee Progress Report
        </Typography>

        <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell align="right">Last Commit</TableCell>
            <TableCell align="right">Progress</TableCell>
            <TableCell align="right">Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         
            <TableRow key={tasks["task_name"]}>

              <TableCell align="right">{tasks["task_name"]}</TableCell>
              <TableCell align="right">{tasks["task_commit"]}</TableCell>
              <TableCell align="right">{tasks["task_percentage"]}</TableCell>
              <TableCell align="right">{tasks["task_deadline"]}</TableCell>
            </TableRow>
      
        </TableBody>
      </Table>
      </Box>
    </div>
  
  )
}

export default ProgressReport
