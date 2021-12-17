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

app.get("/order/:username.:amount.:address.:billingaddress.:type", async(req, res) => {
    let orderNum = await order(req.params.address, req.params.billingaddress, req.params.username, req.params.amount)
    console.log("RESPONSE", orderNum)
    res.json({result: orderNum})
})
app.get('/orderbook/:order_num.:isbn', async(req, res) => {
    await orderBook(req.params.order_num, req.params.isbn);
})

app.get('/getorders/:username', async(req, res) =>{
    let orders = await getOrders(req.params.username);
    console.log("orders", orders)
    res.json({result: orders})
})

app.get('/updatecopies/:orderNum', async(req, res) =>{
    await updateCopies(req.params.orderNum)
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
    client.end()
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
                client.end()
                return "true";
             }
            else{
               
                console.log("failure")
                client.end()
                return "false";
            }
        }
        else{
                console.log("failure");
                client.end()
                return "true";
        }
    }catch(err){
        console.log("sql error", err);
        ; 
        client.end()
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
        client.end()
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
        client.end() 
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
        console.log(username)
        await client.connect()
        await client.query("insert into basket_item values('" + username + "', '" + isbn + "')")
        client.end()
        console.log("added")
    }
    catch(err){
        client.end()
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
        client.end()
        return res.rows
    }
    catch(err){
        client.end()
        console.log("cart sql error:", err)
    }
}

async function getOrders(username){
    let client = new postgresql.Client( {connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
    try{
        await client.connect()
        //get all isbns + duplicates for how many copies
        //use a join probably
        let booksArray = []

        let res = await client.query("select * from orders where username =" + "'" + username + "'")
        let i = 0; 
        for(i; i < res.rows.length; i++){
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



async function updateCopies(order_num){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
    )
    try{
        await client.connect()
        let res = await client.query("select * from book inner join order_book on book.isbn = order_book.isbn where order_book.order_num = '" + order_num + "';")
     
        let i = 0;
        for(i; i < res.rows.length; i++){
            let copies = await client.query("select num_of_copies from book where book_name = '" + res.rows[i].book_name + "'")
            let updatedCopies = parseInt(copies.rows[0].num_of_copies) - 1; 
           
            await client.query("update book set num_of_copies = '" + updatedCopies + "' where book_name = '" + res.rows[i].book_name + "';")
            console.log("updated copies")
            client.end()
        }
    }catch(error)
    { console.log("update copy error", error)}
}

async function order(billing_address, shipping_address, username, amount){
    const client = new postgresql.Client({
        connectionString: connection,
        ssl: {
            rejectUnauthorized: false 
        }}
        );
        
    try {
        client.connect() 
        let orderNum; 
        let lastNum = await client.query("select max(cast(order_num as int)) from orders");

        if(lastNum.rows[0].max){
            console.log("executing if", lastNum.rows[0])
            orderNum = parseInt(lastNum.rows[0].max) + 1; 
            console.log("ORDERNUM")
            await client.query("insert into orders values('" + orderNum + "','" + username + "','" + billing_address + "','" + shipping_address + "', 'warehouse', '" + amount + "');") 
        }
        else{ 
            console.log("executing else")
            orderNum = 1
            await client.query("insert into orders values('" + orderNum + "','" + username + "','" + billing_address + "','" + shipping_address + "', 'warehouse', '" + amount + "');") 
         }
        
         console.log("RESULT in function", orderNum)
        
        client.end()
        return orderNum; 
        
    }
    catch(err){console.log(err)}
}

async function orderBook(orderNum, isbn){
    console.log("orderBook called", orderNum)

    const client = new postgresql.Client({
        connectionString: connection,
            ssl: {
                rejectUnauthorized: false 
            }
        }
    );
    try {
        await client.connect()
        await client.query("insert into order_book values('" + orderNum + "', '" + isbn + "')")
        client.end()
        console.log("added order book")
    }
    catch(err){
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


