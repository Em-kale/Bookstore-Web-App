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

//create enpoints for API we will use to request information
//From backend
//req = request, res = resposne
app.get("/newuser/:username-:name-:password-:employee", async (req, res) => {
    newUser(req.params.username, req.params.name, req.params.password, req.params.employee); 
    
    res.json({message: "User added"});
});
//api endpoint called to attempt login and initiate query 
app.get("/loginuser/:username-:password-:employee/", async(req, res)=> {
    const message = await loginUser(req.params.username, req.params.password, req.params.employee)
    res.json({status: message});
})
//api endpoint called to search 
app.get("/search/:searchterm-:searchtype", async (req, res) => {
    const message = await search(req.params.searchterm, req.params.searchtype); 
    res.json({status: message})
})
//api endpoint called to add item to cart
app.get("/addtocart/:isbn-:username", (req, res) => {
    cartAdd(req.params.isbn, req.params.username)
    res.json({message: "added to cart"})
})
//endpoint called to get cart items
app.get("/cart/:username", async(req, res)=>{
    let cartArray = await getCart(req.params.username)
    res.json({result: cartArray})
})
//endpoint cllaed to make order
app.get("/order/:username-:amount-:address-:billingaddress", async(req, res) => {
    console.log(req.params.username)
    let orderNum = await order(req.params.address, req.params.billingaddress, req.params.username, req.params.amount)
    res.json({result: orderNum})
})
//endpoint called to add order_book item
app.get('/orderbook/:order_num-:isbn', async(req, res) => {
    await orderBook(req.params.order_num, req.params.isbn);
})
//endpoint called to get list of orders
app.get('/getorders/:username', async(req, res) =>{
    let orders = await getOrders(req.params.username);
    res.json({result: orders})
})
//api endpoint called to update the number of copies when an order has been made
app.get('/updatecopies/:orderNum', async(req, res) =>{
    await updateCopies(req.params.orderNum)
})
//endpoint called to add a book
app.get('/addbook/:isbn-:publisher_name-:book_name-:author-:genre-:num_of_pages-:percent_take-:price-:num_of_copies-:username', async(req, res)=>{
    await addBook(req.params.isbn, req.params.publisher_name,
         req.params.book_name, req.params.author, req.params.genre, 
         req.params.num_of_pages, req.params.percent_take, req.params.price,
         req.params.num_of_copies, req.params.username)
})
//endpoint called to get both revenue and expense reports
app.get('/getreport/:type', async (req, res) => {
    let report = await getReport(req.params.type)
    res.json({result: report})
})

//function called to return object containing a report
//takes as parameter the type of report, "expense" or "revenue"
async function getReport(type){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );

    try{
        let report; 
        
        //connects to databse
        await client.connect()

        //check report type
        if(type == "expense"){
            //makes query and saves result to variable
             report = await client.query('select * from orders where cast(amount as float) < 0')
             //close connection
             client.end()
        }
        else if(type=="revenue"){
            //make query and save it to variable
            report = await client.query('select * from orders where cast(amount as int) > 0')
            //close connection
            client.end()
        }
        //return the relevant results of the query
        return report.rows
    }
    catch(error){
        console.log("SQL Error: Get Report:", error)
    }
}

//function called to add a book to the databse
//accepts values for all of the columns in book as well as current
//user's username
async function addBook(isbn, publisher_name, book_name, author, genre, num_of_pages, percent_take, price, num_of_copies, username){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );

    try {
        //connect to databse
        await client.connect()
        //query the databse to insert the book
        await client.query("insert into book values ('" + isbn + "','" + publisher_name +
         "','" + book_name + "','" + author + "','" + genre + "','" + num_of_pages + "','" 
         + percent_take + "','" + price + "','" + num_of_copies + "');")
        //close the eonnection
         client.end()
        //call order method that will query the databse to create an associated order from look inna book
        await order("Look Inna Book, 1234 Street Street", "Look Inna Book, 1234 Street Street", username, parseInt(price)*-1)
        
    }catch(error){
        console.log("SQL Error: Add Book:", error)
    }
}

//function to register a new user
//accepts all columns in the tabke for users
async function newUser(username, name, pass, employee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );
        
    try {
    //connect to database
    await client.connect()
    //make insertion query
    await client.query("insert into users values('" + username + "', '" + name + "', '" + pass + "', '" + employee + "')")
    console.log("new user")
    //close connection
    client.end()
    }
    catch(err){console.log(err)}
    ;
}

//function used to loginUser. 
//Takes username, password, and an identifier to determine if the user
//is an employee. 
//Returns true on success, false on failure. 
async function loginUser(username, password, isEmployee){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
    }});
 
    try{
        //connect to databse
        await client.connect();
        //make query to get information associated with username passed to method
        const res = await client.query('select username, pass, is_employee from users where username =' + "'" + username + "';" )
        
        //check if result was sucessful, if not, the user wasn't registered: return false
        if(res.rows[0]){
            //if the query was successful, check to ensure the password, username pair 
            //passed equals the password username pair from databse
            //also check to see if the user has used the correct login: customer vs employee
            if(res.rows[0].username == username && res.rows[0].pass == password
            && res.rows[0].is_employee == eval(isEmployee)){
                //close connection
                console.log("logged in")
                client.end()
                return "true";
             }
            else{
                //close connection
                client.end()
                return "false";
            }
        }
        else{
                //close connection
                client.end()
                return "false";
        }
    }catch(err){
        console.log("sql error", err) 
        //close connection
        client.end()
        return "false";
    }
}

//method called to search the databse for a book
//method accepts the search phrase, and the filter used
async function search(search, type){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }
    })
    try{
        await client.connect();

        //make query and save result to variable
        const res = await client.query("select * from book where lower(" + type + ") = lower('" + search + "');")
        //close databse connection
        client.end()
        //empty array to hold books
        let searchArray=[];
        let i; 
        //for each book returned, add it to an array to be returned
        for(i=0; i < res.rows.length; i++){
            searchArray.push(res.rows[i])     
        }

       return searchArray
    } catch(err){
        client.end() 
        console.log("query error",  err)
    }
}

//function called to add a new basket_item
//accepts the isbn of the book being added to cart and
//the username of the user adding it.
async function cartAdd(isbn, username){
    const client = new postgresql.Client({
        connectionString: connection,
            ssl: {
                rejectUnauthorized: false 
            }
        }
    );

    try {
        //connect to database
        await client.connect()
        //query database to add the basket item
        console.log("isbn", isbn)
        await client.query("insert into basket_item values('" + username + "', '" + isbn + "')")
        //disconnect from database
        client.end()
    }
    catch(err){
        //disconnect from database
        client.end()
        console.log(err)
    }
}

//function to return the cart for a particular user
//takes the username of a suer and returns the book information
//for all of that user's cart items
async function getCart(username){
    let client = new postgresql.Client( {connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
  
    try{
        //connect to database
        await client.connect()
        //make query and save results to a variable to be returned
        let res = await client.query("select * from book inner join basket_item on book.isbn = basket_item.isbn where username = '" + username + "';")
        //disconnect from database
        client.end()
        return res.rows
    }
    catch(err){
        //disconnect from database
        client.end()
        console.log("cart sql error:", err)
    }
}
//function for getting the orders that a user has made
//accepts the username of the user and returns an array of the order information
async function getOrders(username){
    let client = new postgresql.Client( {connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
    try{
        //connect to database
        await client.connect()
        //create empty array to hold the books in the order
        let booksArray = []
        //make query to database to get all of a user's orders and save result to variable
        let res = await client.query("select * from orders where username =" + "'" + username + "'")
        //for each order returned, add all of the books in that order to the book array
        let i = 0; 
        for(i; i < res.rows.length; i++){
            //make query to select all books associated with an order and save to variable
            let value = await client.query("select * from book inner join order_book on book.isbn = order_book.isbn full join orders on orders.order_num = order_book.order_num where order_book.order_num = '" + res.rows[i].order_num + "';")
            booksArray.push(value.rows)
        }

        client.end()
        return booksArray
    }
    catch(err){
        client.end()
        console.log("order sql error:", err)
    }
}

//function to update the number of copies of a book 
//Accepts the order number for the order the books to update are contained within
async function updateCopies(order_num){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
    try{
        //connect to database
        await client.connect()
        //make query to select all books associated with the order
        let res = await client.query("select * from book inner join order_book on book.isbn = order_book.isbn where order_book.order_num = '" + order_num + "';")
       
        let i = 0;
        for(i; i < res.rows.length; i++){
             //for each book, get the current num of copies, and subtract one
            let copies = await client.query("select num_of_copies from book where book_name = '" + res.rows[i].book_name + "'")
            let updatedCopies = parseInt(copies.rows[0].num_of_copies) - 1; 
            //update the book with the new number of copies
            await client.query("update book set num_of_copies = '" + updatedCopies + "' where book_name = '" + res.rows[i].book_name + "';")
            //close connection to database
            client.end()
        }
    }
    catch(error)
    { 
        console.log("update copy error", error)
    }
}

//function to create new order
//accpets all values within order table except order num
//which is calculated within
async function order(shipping_address, billing_address, username, amount){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );
        
    try {
        //connect to database
        client.connect() 
        console.log(amount)
        //get the last order num to be used 
        let orderNum; 
        let lastNum = await client.query("select max(cast(order_num as int)) from orders");
        console.log(lastNum.rows[0])
        //if there are items in the order table, increment the order num amd 
        //add the new item to the order table
        if(lastNum.rows[0].max){
            orderNum = parseInt(lastNum.rows[0].max) + 1; 
            console.log(orderNum);
            await client.query("insert into orders values('" + orderNum + "','" + username + "','" + billing_address + "','" + shipping_address + "', 'warehouse', '" + amount + "');") 
        }
        //if no items in order table, set orderNum to one, and add new item to 
        //order table
        else{ 
            orderNum = 1
            await client.query("insert into orders values('" + orderNum + "','" + username + "','" + billing_address + "','" + shipping_address + "', 'warehouse', '" + amount + "');") 
         }
        //close connection
        client.end()
        return orderNum; 
        
    }
    catch(err){console.log(err)}
}
//function called to add a new
//order_book relationship item
//this function accepts an orderNum, and the book to associate it with
async function orderBook(orderNum, isbn){
    const client = new postgresql.Client({
        connectionString: connection,
            ssl: {
                rejectUnauthorized: false 
            }
        }
    );
    try {
        //connect to database
        await client.connect()
        //add the new item
        await client.query("insert into order_book values('" + orderNum + "', '" + isbn + "')")
        //close connection
        client.end()
    }
    catch(err){
        //close connection
        client.end()
        console.log(err)
    }
}
//return the react application
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../interface/build', 'index.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
});


