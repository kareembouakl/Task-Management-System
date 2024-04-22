import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableFooter, Typography ,Box} from '@mui/material';
import './Payroll.css';
import Nav from './Nav';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [totalPayroll, setTotalPayroll] = useState(0);
  const [totalPayrollColor, setTotalPayrollColor] = useState('');

  const SERVER_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/payroll`);
      const data = await response.json();
      setPayrollData(data);

      // Calculate total payroll
      const total = data.reduce((acc, emp) => acc + emp.salary, 0);
      setTotalPayroll(total);

      // Determine background color for total payroll
      if (total > 500000) {
        setTotalPayrollColor('red');
      } else {
        setTotalPayrollColor('green');
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    }
  };

  return (
    <div>
      <Nav/>
      <Box sx={{display:'flex',flexDirection:'column',width:'100%',alignItems:'center'}}>
        <Typography variant="h5" gutterBottom>
          Employee Payroll
        </Typography>

        <Table sx={{width:'60%'}}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollData.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow style={{ backgroundColor: totalPayrollColor }}>
              <TableCell>
                <Typography color='black' variant="subtitle1">
                  Total Payroll
                </Typography>
              </TableCell>
              <TableCell>
                <Typography  color='black' >{totalPayroll}</Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Box>
    </div>
  );
};

export default Payroll;
