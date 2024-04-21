import React, { useState, useEffect } from 'react';

const TrackProgress = () => {
  // State to store employee data
  const [employees, setEmployees] = useState([]);

  // Fetch employee data from the backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Function to update task completion percentage
  const updateTaskCompletion = async (taskId, employeeId, completionPercentage) => {
    try {
      const response = await fetch(`/update_task_completion/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completion_percentage: completionPercentage })
      });
      if (response.ok) {
        // Task completion updated successfully
        // You may want to update the UI to reflect the change
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
      <h2>Task Progress Tracker</h2>
      {employees.map(employee => (
        <div key={employee.id}>
          <h3>{employee.name}</h3>
          <ul>
            {employee.tasks.map(task => (
              <li key={task.id}>
                {task.title} - Completion: {task.completion_percentage}%
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={task.completion_percentage}
                  onChange={e => updateTaskCompletion(task.id, employee.id, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TrackProgress;
