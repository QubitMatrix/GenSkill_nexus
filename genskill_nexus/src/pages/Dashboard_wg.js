import '../App.css';
import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from './Image_display';
import server_url from './endpoint'
import { Link } from 'react-router-dom';
//Profile page view of client
function DashboardWG()
{
    //Access state details from previous component
    const {state} = useLocation();
    //state variable to store inputs
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();    
    const username = state.username;
    inputs["username"] = username;

    //set profile page values
    const [profile, setProfile] = useState(null);
    
    
    //Get the client details from backend
    useEffect(() => {
      async function fetchData() 
      {
        try 
        {
          const response = await fetch(server_url+"/wg_dashboard", {
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

    

    const handleAccept = (e) => {
        e.preventDefault();
        const {name, value}=e.target;
        console.log("nv"+name+"-"+value)
        setInputs({...inputs,[name]:value});
        console.log("accept task");
    }

    const handleDecision = (e) => {
        e.preventDefault();
        const {name, value}=e.target;
        console.log("nv"+name+"-"+value)
        setInputs({...inputs,[name]:value});
        console.log("Decide status"+JSON.stringify(inputs)+inputs.decision+inputs.contribute+inputs.username);
        const serverUrl = server_url+"/task_decision"; //server endpoint to handle form inputs

        try 
        {
            const response = fetch(serverUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
          });

          if(response.ok)
          {
            let data = response.json();
            alert(data.Message)
            if(data.Message.includes("Successfully"))
            {
              console.log("Decision has been saved");
            }
          }
          else
          {
            console.log("Failed to give decision, server error");
          }
        }
        catch(err)
        { 
          console.log("Server unreachable, try again later."+err);
        }
      }

    //Handle change of value in inputs
    const handleChange = (e) => {
      e.preventDefault();
      const {name, value}=e.target;
      console.log("nv"+name+value)
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
        if(tasks[i][2] === 'Pending')
        {  
          pending_tasks_arr.push(<div>
            <li>
              <Link className="Link" id="view_task"  to={`/view_task`} state={{"task_det":profile !== null? tasks[i] : "", }}>{tasks[i][1]}</Link> <br/><br/>
<button id="accept" name="decision" value="accept" onClick={handleAccept}>Accept</button>
              <button id="reject" name="decision" value="reject" onClick={handleDecision}>Reject</button>
              <div id="choose_contribute">
                <h5>Do u want to contribute 25% of your payment as a donation?</h5>
                <button id="contribute_yes" name="contribute" value="yes" onClick={handleDecision}>Yes</button> 
                <button id="contribute_no" name="contribute" value="no" onClick={handleDecision}>No</button>
              </div>
          <br/><br/>
            </li>
            </div>);
        }
        else if(tasks[i][2] === 'Accept')
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
            <button className='nav' onClick={()=>{navigate('/wisdomguide_dashboard',{state:{username:username}})}}>Dashboard</button>
        <div>
            <button className='logout' onClick={()=>{navigate('/')}}>Log Out</button>
        </div>
        </div>
      
        <div id="client_profile">
            <div id="details">
              <div id="c_profile">
                <h1><u>Username1:</u> {username}</h1>
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

export default DashboardWG;