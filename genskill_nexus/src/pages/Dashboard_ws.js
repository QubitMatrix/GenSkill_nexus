import '../App.css';
import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from './Image_display';
import server_url from './endpoint'
import { Link } from 'react-router-dom';
//Profile page view of client
function DashboardWS()
{
    //Access state details from previous component
    const {state} = useLocation();
    const navigate = useNavigate();    
    const username = state.username;

    //set profile page values
    const [profile, setProfile] = useState(null);
    
    //state variable to store inputs
    const [inputs, setInputs] = useState([]);
    
    //Get the client details from backend
    useEffect(() => {
      async function fetchData() 
      {
        try 
        {
          const response = await fetch(server_url+"/ws_dashboard", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "username": username }),
          });

          if(!response.ok)
          {
            throw new Error("HTTP error, " + response.status);
          }

          else
          {
            //Wait till the server gives the reply and then use that data
            const data = await response.json();
            setProfile(data);
            console.log(JSON.stringify(data));
          }
        } 
        catch(err)
        {
          alert("Server unreachable, try again."+err);
        }
      }
      fetchData();
    }, [username]);

    

    //Handle change of value in inputs
    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      setInputs({...inputs,[name]:value});
    }

    var pending_tasks_arr = []
    var ongoing_tasks_arr = []
    //Combine all the ongoing and pending tasks and insert into unordered lists
    const aggregate_tasks = () => {
      //console.log("check"+profile.tasks)
      if(profile !== null)
      {
        var tasks = profile.tasks;
      } 
      else
      {
        tasks = [];
      }
      
      for(let i=0,j=-1;i<tasks.length;i++)
      {
        if(tasks[i][3] === 'Pending')
        {  
          pending_tasks_arr.push(<div>
            <li>
              <Link className="Link" id="view_task"  to={`/view_task`} state={{"task_det":profile !== null? tasks[i] : "", }}>{tasks[i][1]}</Link>
          <br/><br/>
            </li>
            </div>);
        }
        else if(tasks[i][3] === 'Accepted')
        {  
          ongoing_tasks_arr.push(<div>
            <li>
              <Link className="Link" id="view_task" to ={`/view_task`} state={{"task_det":profile !== null? tasks[i] : "", }}>{tasks[i][1]}</Link>
          <br/><br/>
            </li>
            </div>);
        }
      }
    }

    aggregate_tasks();
    //Page rendered for client profile
    return (
      <div>
        <div className='header'>
            <button className='nav' onClick={()=>{navigate('/wisdomseeker_dashboard',{state:{username:username}})}}>Dashboard</button>
            <button className='nav' onClick={()=>{navigate('/create_task',{state:{username:username}})}}>New Task</button>
        <div>
            <button className='logout' onClick={()=>{navigate('/')}}>Log Out</button>
        </div>
        </div>
      
        <div id="client_profile">
            <div id="details">
              <div id="c_profile">
                <h1><u>Username:</u> {username}</h1>
                <h2>Pending Tasks</h2>
                {pending_tasks_arr}
                <h2>Ongoing Tasks</h2>
                {ongoing_tasks_arr}
                <br/> 
              </div>
            </div>
        </div>
      <section id="footer">&copy;2024 GenSkill Nexus<br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/GenSkill-Nexus">Source code</a></section>
        </div>
    )
}

export default DashboardWS;