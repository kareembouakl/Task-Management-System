import React, { useState, useEffect } from 'react';
import './TrackProgress.css'
import Nav from './Nav';
const TrackProgress = () => {
  // State to store employee data and their tasks
  const [employees, setEmployees] = useState([]);
  const [employeeTasks, setEmployeeTasks] = useState({});
  const SERVER_URL = "http://127.0.0.1:5000";

  // Fetch employee data from the backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/employees`);
      const data = await response.json();
      setEmployees(data);
      fetchAllEmployeeTasks(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Function to fetch tasks assigned to each employee
  const fetchAllEmployeeTasks = async (employees) => {
    const tasksByEmployee = {};
    for (const employee of employees) {
      try {
        const response = await fetch(`${SERVER_URL}/employee_tasks/${employee.id}`);
        const taskAssignments = await response.json();
        tasksByEmployee[employee.id] = taskAssignments;
      } catch (error) {
        console.error(`Error fetching tasks for employee ${employee.id}:`, error);
      }
    }
    setEmployeeTasks(tasksByEmployee);
  };

  // Function to update task completion percentage
  const updateTaskCompletion = async (taskId, employeeId, completionPercentage) => {
    try {
      // Handle empty completionPercentage (null or empty string)
      const parsedCompletionPercentage = completionPercentage === null || completionPercentage === '' ? 0.0 : parseFloat(completionPercentage);
  
      const response = await fetch(`${SERVER_URL}/update_task_completion/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completion_percentage: parsedCompletionPercentage })
      });
      if (response.ok) {
        // Task completion updated successfully
        // Update the state with the new completion percentage
        fetchAllEmployeeTasks(employees)
        console.log('Task completion updated successfully');
      } else {
        // Handle error
        console.error('Error updating task completion');
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };
  
  
  
  
  

  return (
    <div>
      <Nav/>


  <div style={{width:'100%',height:'90%',display:'flex',flexDirection:'column',alignItems:'center',marginTop:'1%'}}>
  <h2>Task Progress Tracker</h2>
  {employees.map(employee => (
    <div id='people' key={employee.id}>
      <h3>{employee.name}</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Assigned Percentage</th>
            <th>Completion Percentage</th>
          </tr>
        </thead>
        <tbody>
          {employeeTasks[employee.id] && employeeTasks[employee.id].map(taskAssignment => (
            <tr key={taskAssignment.id}>
              <td>{taskAssignment.title}</td>
              <td>{taskAssignment.assigned_percentage}</td>
              <td>
              <input
    style={{ padding: '10px', border: 'none' }}
    type="number"
    min={0}
    max={100}
    value={taskAssignment.completion_percentage === null ? 0 : taskAssignment.completion_percentage}
    onChange={e => updateTaskCompletion(taskAssignment.id, employee.id, parseFloat(e.target.value))}
/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}
  </div>
</div>

  );
};

export default TrackProgress;
