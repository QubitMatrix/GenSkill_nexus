const bcrypt = require('bcryptjs');
const express = require('express');
require("dotenv").config();
const multer = require('multer');
const cors = require('cors');
const validate = require("./validate.js");
const mysql = require('mysql2');

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
let final_msg=null
const PORT = 3000;
app.use(cors());
app.options('*',cors());
app.use(express.json());

console.log("env"+process.env.DB_USER)
//Database
const db_admin = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//Route for authentication
app.post("/authenticate", (req, res) => {
        const password = req.body.password;
    const username = req.body.username;
    console.log(validate.validate_password(password)+" "+validate.validate_username(username,30))
    if(validate.validate_password(password) && validate.validate_username(username,30))
    {
        db_admin.query("SELECT password, user_type FROM users WHERE username='"+username+"';", function(err, result) {
            if(err) throw err;
            console.log(result);
            const stored_password = result.map(row => row.password);
            const usertype = result.map(row => row.user_type);
            if(stored_password.length == 0)
                res.json({"Message":"Username not found"});
            else 
            {
                //compare if the password entered on hashing gives the hashed-password stored in the database 
                console.log(password +" " + stored_password[0] + " " + bcrypt.compare(password, stored_password[0]))
                bcrypt.compare(password, stored_password[0])
                .then( match => { 
                    if(! match) 
                        res.json({"Message": "Wrong Password"});
                    else
                    {
                        console.log(usertype[0])
                        if(usertype[0] === "wisdomguide")
                            res.json({"Message": "wisdomguide"}); 
                        else if(usertype[0] === "wisdomseeker")
                            res.json({"Message":"wisdomseeker"});
                    }
                });
            }
        });
    }
    else
    {
        res.send({"Message":"Invalid username or password(Username should start with letter and have only letters,digits and _ (maxlength 30), Password can only contain letters, digits and @ # $ ! % & (8 to 30 length))"})
    }
});

//Route for posting user registration 
app.post("/register_user", (req,res) => {
    const person_name = req.body.person_name;
    console.log(validate.validate_name(person_name));
    const email_id = req.body.email;
    console.log(validate.validate_email(email_id));
    const password = req.body.password;
    const username = req.body.username;
    console.log(validate.validate_username(username));
    const usertype = req.body.usertype;
    const phone = req.body.phone;

    if(!validate.validate_name(person_name) || !validate.validate_email(email_id))
    {
        res.send({"Message":"Invalid inputs(Name should contain only letters (maxlength 80), Username should start with letter and have only letters,digits and _ (maxlength 30), Password can only contain letters, digits and @ # $ ! % & (8 to 30 length)"})
    }

    else
    {
        //Running the insert query on the database
        //One query to handle all possible possibilities of first,middle and last name presence
        const insert_query = "INSERT INTO users(username, email_id, password, phone, name, user_type) VALUE('" + username + "', '" + email_id + "', '" + password + "', '" + phone + "', '" + person_name + "', '"+ usertype + "');";
        console.log(insert_query); 
        db_admin.query(insert_query, function(err, result) {
            if(err)
            { 
                if(err.errno === 1062)
                {
                    res.send({"Message":"Username or email taken"});
                }
                else
                {
                    throw err
                }
            } 
            else
            {
                console.log(result);
                res.send({"Message":"Successfully registered"}); //without this no response sent to frontend
            }
        });
    }
});

//Route for posting freelancer registration 
app.post("/register_wg", (req, res) => {
    const username=req.body.username;
    console.log(validate.validate_username(username));
    var professions = req.body.professions;
    var skills = req.body.skills;
    var experiences = req.body.experiences;
    var domains = req.body.domains;

    if(validate.validate_username(username))
    {
        //Insert wisdom guide details into the wisdomguide table
        var insert_query = "INSERT INTO wisdomguide VALUE('" + username + "', '" + professions + "', '" + skills + "', '" + experiences + "', '" + domains + "');";
        console.log(insert_query);
        db_admin.query(insert_query, function(err, result) {
            if(err) throw err;
            console.log(result);
        });
        res.send({"Message":"Registration successful"});
    }
    else
    {
        res.send({"Message":"Invalid username or other details"})
    }
});

//app listening on port 3000
app.listen(3000,() => {
    console.log(`Server is running on ${PORT}`);
});



// Define a route for file upload
app.post('/upload_profile', upload.single('profile_pic'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    //Save image data with username acting as unique id
    const image = {
      username: req.body.username,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
 
    // Store the image in the MySQL database
    db_admin.query('INSERT INTO image SET ?', image, (err, result) => {
      if (err) 
      {
        console.error('Error storing image in MySQL:', err);
        return res.status(500).json({ error: 'Image upload failed' });
      }
      res.json({ message: 'File uploaded successfully' });
    });
});
  
//Route which retrieves profile picture
app.get('/display_image/:id', (req, res) => {
  const imageId = req.params.id;

  db_admin.query('SELECT data, contentType FROM image WHERE username = ?', [imageId], (err, result) => {
    if(err) 
    {
      console.error('Error retrieving image from MySQL:', err);
      return res.status(500).json({ error: 'Image retrieval failed' });
    }

    if (result.length === 0) 
    {
      return res.status(404).json({ error: 'Image not found' });
    }

    //Prepare a response with data along with the header having the content-type set
    const imageData = result[0];
    res.setHeader('Content-Type', imageData.contentType);
    res.end(imageData.data);
  });
});




//Route for sending client details to frontend
app.post("/ws_dashboard", (req, res) => {
    const username = req.body.username;

    let retrieve_query="SELECT * FROM users WHERE username='"+username+"';";
    db_admin.query(retrieve_query, function(err, result) {
        if(err) throw err;
        let name1 = result.map(row => row.name)[0];

        retrieve_query = "SELECT * FROM tasks WHERE ws='"+username+"';"
        db_admin.query(retrieve_query, function(err, result) {
            if(err) throw err;
            let tasks = result.map(row => [row.task_id, row.taskname, row.taskdesc, row.state, row.domains, row.wg, row.amount]);
            console.log(tasks);
            res.json({"person_name": name1, "tasks": tasks});
        });
    });
});

//Route for sending client details to frontend
app.post("/wg_dashboard", (req, res) => {
    const username = req.body.username;
        console.log("abc1"+username);

    let retrieve_query="SELECT * FROM users WHERE username='"+username+"';";
    db_admin.query(retrieve_query, function(err, result) {
        if(err) throw err;
        let name1 = result.map(row => row.name)[0];

        console.log("abc"+username);
        retrieve_query = "SELECT * FROM task_allotment WHERE username='"+username+"';"
        db_admin.query(retrieve_query, function(err, result) {
            if(err) throw err;
            let tasks = result.map(row => [row.task_id, row.taskname, row.status]);
            console.log(tasks);
            res.json({"person_name": name1, "tasks": tasks});
        });
    });
});


app.post("/create_task", (req, res) => {
    console.log(req.body.username+" "+req.body.details)
    var insert_query = "INSERT INTO tasks (taskname, taskdesc, domains, ws, amount) VALUE ('" + req.body.task_name + "', '" + req.body.details + "', '" + req.body.domains + "', '" + req.body.username + "', " + req.body.amount + ");";
    console.log(insert_query);
    db_admin.query(insert_query, function(err, result) {
        if(err) 
        {
            res.json({"Message": "Error in creating task"});
            //throw err;
        }
        else
        {
            console.log(result);
            res.json({"Message": "Successfully created task"});
        }
    });
});

//Route for posting freelancer registration 
app.post("/task_decision", (req, res) => {
    console.log(req.body.decision+req.body.username+req.body.contribute) //+req.body.username+" "+req.body.task_id+req.body.contribute);

        //Insert wisdom guide details into the wisdomguide table
        if(req.body.contribute && req.body.contribute=="Accept")
        {
            var insert_query = "UPDATE task_allotment SET status='Accept', contribute='"+req.body.contribute+"');";
            console.log(insert_query);
            db_admin.query(insert_query, function(err, result) {
                if(err) throw err;
                console.log(result);
                res.send({"Message":"Successfully received decision"});
            });
        }
        else
        {
            res.send({"Message":"Decision not stored"});
        }
        
});