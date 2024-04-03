import React, { useState, useCallback } from "react";
import { Typography, Select, MenuItem, InputLabel } from '@mui/material';
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
        <Typography variant="h5">Tasks:</Typography>
        {selectedEmployee && (<DataGrid
            columns={[
                { field: 'id', headerName: 'ID' },
                { field: 'usd_amount', headerName: 'USD Amount' },
                { field: 'lbp_amount', headerName: 'LBP Amount' },
                { field: 'usd_to_lbp', headerName: 'Trans Type' },
                { field: 'added_date', headerName: 'Date' },
                { field: 'user_id', headerName: 'MyID' }
            ]}
            rows={tasks}
            autoHeight
        />)}
    </div>  
    )
}

export default TaskTable