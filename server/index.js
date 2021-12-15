//initialize server
const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express(); 

//get environment variables
require('dotenv').config()

//set database variables

const postgresql = require('pg');
const connection = process.env.CONNECTION; 

 
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../interface/build')));

//create enpoint for API we will use to request information
//From backend
//req = request, res = resposne
app.get("/newuser/:username.:name.:password.:employee", async (req, res) => {
    newUser(req.params.username, req.params.name, req.params.password, req.params.employee); 
    res.json({message: "User added"});
});

app.get("/loginuser/:username.:password.:employee", async(req, res)=> {
    const message = await loginUser(req.params.username, req.params.password, req.params.employee)
    if(message)
    {   
        console.log("message", message)
        res.json({status: message});
    }
    else{
        console.log("error: no message recieved")
    }
})

async function newUser(username, name, pass, employee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );
        
    try {
    await client.connect()
    await client.query("insert into users values('" + username + "', '" + name + "', '" + pass + "', '" + employee + "')")
    }
    catch(err){console.log(err)}
    client.end();
}

async function loginUser(username, password, isEmployee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
    }});
    let message; 
    await client.connect();
    try{
        const res = await client.query('select username, pass, is_employee from users where username =' + "'" + username + "';" )
        if(res.rows[0]){
            if(res.rows[0].username == username && res.rows[0].pass == password
            && res.rows[0].is_employee == eval(isEmployee)){
                console.log("success");
                return "true";
             }
            else{
               
                console.log("failure")
                return "false";
            }
        }
        else{
                console.log("failure");
                return "true";
        }
    }catch(err){
        console.log("sql error", err);
        return "false";
    }
}

//return the react application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../interface/build', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});


