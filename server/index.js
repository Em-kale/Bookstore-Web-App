//initialize server

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express(); 


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../interface/build')));

//create enpoint for API we will use to request information
//From backend
//req = reqiest, res = resposne
app.get("/api", (req, res) => {
    res.json({message: "Hello from Server"});
});

//return the react application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../interface/build', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});


