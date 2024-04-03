import React, { useState, useCallback } from "react";
import { Typography, Select, MenuItem, InputLabel, Table, TableCell, TableHead, TableRow, TableBody } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getUserToken, saveUserToken, clearUserToken } from "../localStorage";

import Nav from "./Nav";
import SERVER_URL from '../App'


function TaskTable() {
    const [tasks, setTasks] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [userToken, setUserToken] = useState(getUserToken());

    const employees = ["Eric Njeim","Kareem Bou Akl","Yehya"]; 

    const handleChangeEmp = (event) => {
        setSelectedEmployee(event.target.value);
        fetchEmployeeTasks();
    };

    const fetchEmployeeTasks = useCallback(() => {
        fetch(`${SERVER_URL}/employee/${selectedEmployee/*ID*/}/task`, {
            headers: {
                Authorization: `bearer ${getUserToken()}`,
            },
        })
            .then((response) => response.json())
            .then((tasks) => setTasks(tasks));
    }, [getUserToken()]);

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
                {employees.map((e, index) => (
                    <MenuItem key={index} value={e}>{e}</MenuItem>
                ))}
            </Select>
        </div>
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
    </div>  
    )
}

export default TaskTable