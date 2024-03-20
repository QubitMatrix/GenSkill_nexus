import '../App.css';
import React, {useState, useEffect} from 'react'
import ImageUpload from './Image';
import { useLocation,useNavigate } from 'react-router-dom';
import server_url from './endpoint'


//Registration page extension, for wisdom guide
function RegisterWG()
{
    const [inputs, set_inputs] = useState({});

    //Access state details from previous component
    const {state} = useLocation();
    const navigate=useNavigate()
    const username = state.username;
    inputs["username"] = username;


    //handles changes in input fields and hooks them with the `inputs` variable
    const handleChange = (e) => {
      e.preventDefault(); //prevents page refreshing after form submission
      const {name, value} = e.target; //destructuring assignment to extract name and value from target DOM element
      set_inputs({...inputs, [name]:value});
    }

    //handles submission of form and connects to the backend
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Form submitted");
      console.log("inputs" + JSON.stringify(inputs));
      const serverUrl = server_url+"/register_wg"; //server endpoint to handle form inputs

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        if (response.ok)
        {
          let data = await response.json();
          alert(data.Message)
          
          if(data.Message.includes("profile"))
          {
            //Display file upload
            const div1 = document.getElementById("upload_profile_placeholder")
            div1.style.display = "block";
          }
        }
        else 
        {
          alert("Failed to register, server error")
        }
      }
      catch (err) 
      {
        alert("Server unreachable, try again later."+err);
      }   
    }
    
    return(
        <div>
            <div className='header'>
                <button className='nav' onClick={()=>navigate('/')}>Home</button>
                <button className='nav' onClick={()=>{navigate('/login')}}>Log In</button>
            </div>
            <h1>Wisdom Guide</h1><br/>
            <div className='wg_form_div'>
            <form id="reg_wg_form"  onSubmit={handleSubmit}>
                <label className='reg_label'>Professions</label> &nbsp;
                <input id="professions" className="reg_input" type="text" name="professions" value={inputs.professions} onChange={handleChange} required /> <br/>
                <br/>
                <label className='reg_label'>Skills</label> &nbsp;
                <input id="skills" className="reg_input" type="text" name="skills" value={inputs.skills} onChange={handleChange} required /> <br/>
                <br/>
                <label className='reg_label'>Experience</label> &nbsp;
                <input id="experiences" className="reg_input" type="text" name="experiences" value={inputs.experiences} onChange={handleChange} required /> <br/>
                <br/>
                <label className='reg_label'>Domains</label> &nbsp;
                <input id="domains" className="reg_input" type="text" name="domains" value={inputs.domains} onChange={handleChange} required /> <br/>
                <br/>
                <input className="submit_button" type="submit" name="submit" value="Submit"/>
                <br/>
                <div id="upload_profile_placeholder">
                <ImageUpload username={inputs.username} /> 
                </div>
                <br/>
            </form>
            </div>
        </div>
    )
}

export default RegisterWG;