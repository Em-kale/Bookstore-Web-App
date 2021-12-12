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
app.get("/newuser/:username.:name.:password.:employee", (req, res) => {
    console.log("REQ", req.params);
    newUser(req.params.username, req.params.name, req.params.password, req.params.employee); 
    res.json({message: "User added"});

});

async function newUser(username, name, pass, employee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );
        
    let query 
    try {
    await client.connect()
    await client.query("insert into users values('" + username + "', '" + name + "', '" + pass + "', '" + employee + "')")
    query  = await client.query("select * from users")
    }
    catch(err){console.log(err)}
    console.log("QUERY", query)
    client.end();
}

//return the react application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../interface/build', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});


