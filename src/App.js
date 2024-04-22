import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './components/Home';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom';
import AddTaskForm from './components/AddTaskForm';
import AddEmployeeForm from './components/AddEmployeeForm';
import AssignTaskToEmployee from './components/AssignTaskToEmployee';
import TaskTable from './components/TaskTable';
import TrackProgress from './components/TrackProgress';
import SkillMatching from './components/SkillMatching';
import Carpooling from './components/Carpooling';
import Inbox from './components/Inbox';
import Email from './components/Email';
import Payroll from './components/Payroll';

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
          <Route path='/taskprogress' element={<TrackProgress/>} />
          <Route path='/skillmatching' element={<SkillMatching/>} />
          <Route path='/carpooling' element={<Carpooling/>} />
          <Route path='/inbox' element={<Inbox/>} />
          <Route path='/email' element={<Email/>} />
          <Route path='/payroll' element={<Payroll/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
