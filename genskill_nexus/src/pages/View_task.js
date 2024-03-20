import '../App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import React, {useState} from 'react'
import { Link } from 'react-router-dom';


//Detailed project view
function ViewTask()
{
    //Set up a navigate object for safer routing
    const navigate = useNavigate();

    //Access the states from previous location (in this case project details and freelancer_id from projects page)
    const {state} = useLocation();

    const task_det = state["task_det"];

    console.log("task"+task_det[3])
    /*var domains_arr = [];
    var skills_arr = [];
    var freelancers_arr = [];

    //Extract skills, domains and freelancers as lists from string format
    function aggregate (arr,field)
    {
        for(let i=0;i<arr.length;i++)
        {
            field.push(<li>{arr[i]}</li>)
        }
    }

    //call the aggregate function for forming each list
    aggregate(project_state[6]? project_state[6].split(",") : [],domains_arr);
    aggregate(project_state[7]? project_state[7].split(",") : [],skills_arr);
    aggregate(project_state[8]? project_state[8].split(",") : [],freelancers_arr);
    */
    //Page rendered for project_details
    return(<div>
    <div>
        <h1>Task Name</h1>
        <p>{task_det[1]}</p>
        <h2>Task Details</h2>
        <p>{task_det[2]}</p>
        <h2>Task Payment Amount</h2>
        <p>{task_det[4]}</p>
        <button><Link to={"http://localhost:3002"} > Chat </Link></button> &nbsp;  
		<button><Link to={"/schedule"}> Schedule </Link></button>
	  
    </div>    
      <section id="footer">&copy;2024 GenSkill Nexus<br/><img id="github-img" src="https://img.icons8.com/material-outlined/48/null/github.png" alt="github icon"/><a href="https://github.com/QubitMatrix/GenSkill-Nexus">Source code</a></section>
    </div>)
}

export default ViewTask;