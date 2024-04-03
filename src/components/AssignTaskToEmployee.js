import { useState } from 'react'
import { InputLabel, Select, MenuItem, Box, Button, Typography } from '@mui/material';
import Nav from './Nav'


function AssignTaskToEmployee() {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedTask, setSelectedTask] = useState('');

    const employees = ["Eric Njeim","Kareem Bou Akl","Yehya"]; 
    const tasks = ["Android - Fix bugs","Website - Update Home page","Desktop - Update About page"]; 

    const handleChangeEmp = (event) => {
        setSelectedEmployee(event.target.value);
    };
    const handleChangeTask = (event) => {
        setSelectedTask(event.target.value);
    };

    const assign = (event) => {
        /* BACKEND: EDIT A TASK */
    }

  return (
    <div>
    <Nav />
    <Box sx={{display:'flex',flexDirection:'column',alignItems: 'center'}}>
        <Typography 
            variant="h4" component="div" 
            sx={{ flexGrow: 1, justifyContent:'center', margin: 5 }}>
            Assign Task to Employee
        </Typography>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}} >
            <div style={{ marginRight: 10, width: '50%' }}>
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
                    
                    sx={{ width: 300 }}
                >
                    {employees.map((e, index) => (
                        <MenuItem key={index} value={e}>{e}</MenuItem>
                    ))}
                </Select>
            </div>
            <div style={{ marginLeft: 10, width: '50%' }}>
                <InputLabel 
                    id="select-task-label"
                    sx={{ fontSize: 24 }}
                >Select a task</InputLabel>
                <Select
                    labelId="select-task-label"
                    id="select-task"
                    value={selectedTask}
                    label="Select a task"
                    onChange={handleChangeTask}
                    
                    sx={{ width: 300 }}
                >
                    {tasks.map((t, index) => (
                        <MenuItem key={index} value={t}>{t}</MenuItem>
                    ))}
                </Select>
            </div>
        </Box>
        <Button
            sx={{backgroundColor: 'teal', color: 'white', margin: 5}}
            onClick={assign}
        >Assign
        </Button>
    </Box>
    </div>
  )
}

export default AssignTaskToEmployee