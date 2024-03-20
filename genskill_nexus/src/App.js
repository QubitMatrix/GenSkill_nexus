import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DashboardWG from './pages/Dashboard_wg';
import DashboardWS from './pages/Dashboard_ws';
import Register from './pages/Register';
import RegisterWG from './pages/Register_wg';
import Login from './pages/Login';
import CreateTask from './pages/Create_task';
import ViewTask from './pages/View_task';
import Schedule from './pages/Schedule';

class Home extends React.Component
{
  render()
  {
    return(
      <div>
        <h1>Genskill Nexus</h1>
        <p>Intergenerational Skills Marketplace</p>
        <div>
          <button className='button' id="reg_button" onClick={()=>document.location="/register"}>Register</button>
          <button className='button' id="login_button" onClick={()=>document.location="/login"}>Login</button>
        </div>
        <section id="footer">&copy;2024 GenSkill Nexus<br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/GenSkill-Nexus">Source code</a></section>
      </div>
    )
  }
}
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/register_wisdomguide" element={<RegisterWG/>}></Route>
        <Route path="/wisdomguide_dashboard" element={<DashboardWG/>}></Route>
        <Route path="/wisdomseeker_dashboard" element={<DashboardWS/>}></Route>
        <Route path="/create_task" element={<CreateTask/>}></Route>
        <Route path="/view_task" element={<ViewTask/>}></Route>
       
		<Route path="/schedule" element={< Schedule/>}></Route>
      </Routes>  
    </Router>
  );
}

export default App;
