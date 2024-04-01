import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './Home';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom';
import AddTaskForm from './AddTaskForm';
import AddEmployeeForm from './AddEmployeeForm';

function App() {

  return(
    <div>
      <Router>
  <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/addemp' element={<AddEmployeeForm/>} />
    <Route path='/addtask' element={<AddTaskForm/>} />
    
  </Routes>
</Router>

    </div>
  );
}

export default App;
