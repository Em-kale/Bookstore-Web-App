//initialize server
const express = require("express");
const PORT = process.env.PORT || 3001;
const path = require('path');
const app = express(); 

//get environment variables
require('dotenv').config()

//set database variables

const postgresql = require('pg')
const connection = process.env.DATABASE_URL; 

 
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../interface/build')));

//create enpoint for API we will use to request information
//From backend
//req = request, res = resposne
app.get("/newuser/:username.:name.:password.:employee", async (req, res) => {
    newUser(req.params.username, req.params.name, req.params.password, req.params.employee); 
    res.json({message: "User added"});
});

app.get("/loginuser/:username.:password.:employee/", async(req, res)=> {
    const message = await loginUser(req.params.username, req.params.password, req.params.employee)
    if(message)
    {   
        console.log("login message", message)
        res.json({status: message});
    }
    else{
        console.log("error: no message recieved")
    }
})

app.get("/search/:searchterm.:searchtype", async (req, res) => {
    const message = await search(req.params.searchterm, req.params.searchtype); 
    if(message){
        console.log("search message", message)
        res.json({status: message})
    }
    else{
        console.log("error: no message recieved")
    }
})

app.get("/addtocart/:isbn.:username", (req, res) => {
    console.log("called")
    cartAdd(req.params.isbn, req.params.username)
    res.json({message: "added to cart"})
})

app.get("/cart/:username", async(req, res)=>{
    let cartArray = await getCart(req.params.username)
    res.json({result: cartArray})
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
    ;
}

async function loginUser(username, password, isEmployee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
    }});
 
    try{
        await client.connect();
        const res = await client.query('select username, pass, is_employee from users where username =' + "'" + username + "';" )
        if(res.rows[0]){
            if(res.rows[0].username == username && res.rows[0].pass == password
            && res.rows[0].is_employee == eval(isEmployee)){
                console.log(res)
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
        ; 
        return "false";
    }
}

async function search(search, type){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }
    })
    try{
        await client.connect();

        console.log('search', search);
        console.log('type', type); 
        const res = await client.query("select * from book where lower(" + type + ") = lower('" + search + "');")
       
        console.log(res)
        let searchArray=[];
        
        let i; 
        for(i=0; i < res.rows.length; i++){
            let book = {
                ISBN: res.rows[i].isbn,
                publisher_name: res.rows[i].publisher_name,
                book_name: res.rows[i].book_name, 
                author: res.rows[i].author,
                genre: res.rows[i].genre, 
                num_of_pages: res.rows[i].num_of_pages,
                percent_take: res.rows[i].percent_take,
                price: res.rows[i].percent_take, 
                num_of_copies: res.rows[i].num_of_copies,
            }   
            console.log(book)
            searchArray.push(book)     
        }
        console.log("search result:", searchArray)
        
       return searchArray
    } catch(err){
        console.log("query error",  err)
    }
}

async function cartAdd(isbn, username){
    const client = new postgresql.Client({
        connectionString: connection,
            ssl: {
                rejectUnauthorized: false 
            }
        }
    );
    try {
        console.log(isbn)
        await client.connect()
        await client.query("insert into basket_item values('" + username + "', '" + isbn + "')")
        console.log("added")
    }
    catch(err){
        console.log(err)
    }
    ;
}

async function getCart(username){
    let client = new postgresql.Client( {connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
  
    try{
        await client.connect()
        //get all isbns + duplicates for how many copies
        //use a join probably
        let res = await client.query("select * from book inner join basket_item on book.isbn = basket_item.isbn where username = '" + username + "';")
        console.log(res.rows)
        return res.rows
    }
    catch(err){
        console.log("cart sql error:", err)
    }
}
//return the react application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../interface/build', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});


