import React, {useState} from 'react';
import server_url from './endpoint'
import { useLocation,useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'

function CreateTask()
{
    //handle form inputs
    const [inputs, setInputs] = useState({});

    //navigate object
    const navigate = useNavigate();
    const {state} = useLocation();
    const username = state.username;
    inputs["username"] = username;

    const handleChange = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const {name, value} = e.target; //destructuring assignment to extract name and value from target DOM element
      setInputs({...inputs, [name]:value});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(inputs);
        console.log("inputs"+JSON.stringify(inputs));
        console.log("Form submitted");
        

        const serverUrl = server_url+"/create_task"; //server endpoint to handle form inputs

        try 
        {
            const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
          });

          if(response.ok)
          {
            let data = await response.json();
            alert(data.Message)
            if(data.Message.includes("Successfully"))
            {
              alert("Task created, please wait to be assigned to a wisdom guide");
            }
          }
          else
          {
            alert("Failed to create task, server error");
          }
        }
        catch(err)
        { 
          alert("Server unreachable, try again later."+err);
        }
      }

    return(
        <div>
        <div className='header'>
            <button className='nav' onClick={()=>{navigate('/')}}>Home</button>
            <button className='nav' onClick={()=>{navigate('/login')}}>Log In</button>
        </div>
      
      <div className='newtask-page'>
        <h1>Create new task</h1>
        <br/>
        <div className='newtask_div'>
        <form id="newtask_form" onSubmit={handleSubmit}>
          <label className='task_label'>Task Name</label> &nbsp;
          <input id="task_name" className="task_input" type="text" name="task_name" value={inputs.task_name} onChange={handleChange} required /> <br/>
          <br/>
          <label className='task_label'>Task Details</label> &nbsp;
          <input id="details" className="task_input" type="text" name="details" value={inputs.details} onChange={handleChange} required /> <br/>
          <br/>
          <label className='task_label'>Domain</label> &nbsp;
          <input id="domains" className="task_input" type="text" name="domains" value={inputs.domains} onChange={handleChange} required /> <br/>
          <br/>
          <label className='task_label'>Amount (min Rs.100)</label> &nbsp;
          <input id="amount" className="task_input" type="number" name="amount" value={inputs.amount} onChange={handleChange} min={100} required /> <br/>
          <br/>
          
          <button className='button' type="submit">Submit</button>
          <br/>
        </form>
        </div>
      </div>
      <section id="footer">&copy;2024 GenSkill Nexus<br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/GenSkill-Nexus">Source code</a></section>
      </div>
    );
}

export default CreateTask; 