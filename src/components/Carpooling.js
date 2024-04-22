import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, Divider } from '@mui/material';
import Nav from './Nav';

const SERVER_URL = "http://127.0.0.1:5000";

function Carpooling() {
    const [employees, setEmployees] = useState([]);
    const [groupedEmployees, setGroupedEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/employees`);
            const data = await response.json();
            setEmployees(data);
            groupEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const groupEmployees = (employees) => {
        const groups = employees.reduce((acc, curr) => {
            acc[curr.address] = acc[curr.address] || [];
            acc[curr.address].push(curr);
            return acc;
        }, {});

        const groupedData = Object.keys(groups).map(address => ({
            address,
            employees: groups[address],
            transport: groups[address].length < 4 ? 'Car' : 'Van'
        }));

        setGroupedEmployees(groupedData);
    };

    return (
        <div>
            <Nav />
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Carpooling Groups
                </Typography>
                <List>
                    {groupedEmployees.map((group, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                Address: {group.address} - {group.employees.length} employees
                                <List sx={{ ml: 4 }}>
                                    {group.employees.map((emp, idx) => (
                                        <ListItem key={idx}>
                                            {emp.name}
                                        </ListItem>
                                    ))}
                                </List>
                                Transport by: {group.transport}
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </div>
    );
}

export default Carpooling;
