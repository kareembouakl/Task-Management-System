import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './components/Home';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom';
import AddTaskForm from './components/AddTaskForm';
import AddEmployeeForm from './components/AddEmployeeForm';
import AssignTaskToEmployee from './components/AssignTaskToEmployee';
import TaskTable from './components/TaskTable';
import ProgressReport from './components/ProgressReport';

const SERVER_URL = "http://127.0.0.1:5000";


function App() {

  return(
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/addemp' element={<AddEmployeeForm/>} />
          <Route path='/addtask' element={<AddTaskForm/>} />
          <Route path='/assigntask' element={<AssignTaskToEmployee/>} />
          <Route path='/taskprogress' element={<TaskTable/>} />
          <Route path='/progressreport' element={<ProgressReport/>} />

        </Routes>
      </Router>

    </div>
  );
}

export default App;
