import React, {useState, useEffect} from 'react'

//material ui imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField  from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'

function Cart(){
    let axios = require('axios')
    //initialize variables
    const[bookArray, setBookArray] = useState([])
    const[address, setAddress]= useState("")
    const[billingAddress, setBillingAddress] = useState("")
    const[creditNumber, setCreditNumber] = useState("")
    const[securityCode, setSecurityCode] = useState("")
    const[snackbarOpen, setSnackbarOpen] = useState(false)
    let cartResults; 

    //when page loads, call endpoint to get the cart items
    useEffect(()=>{
        //configure endpoint
        let config = {method: 'get', url: '/cart/' + sessionStorage.getItem("logged_in")}
        //call endpoint and save result to variable
         axios(config)
        .then(function (response) {
            setBookArray(response.data.result); 
            }
        )
        .catch(function (error) {
            console.log("error", error);
        });
    }, []);

    //function called to handle an order, and call api endpoint to 
    //add the order information to database
    function handleOrder(){
        let i = 0
        let amount = 0; 
        let orderNum; 
        //calculate amount minus the percent take for the publisher
        for(i; i < bookArray.length; i++){
            amount += (parseInt(bookArray[i].price) - parseInt(bookArray[i].price) * (parseInt(bookArray[i].percent_take))/100)
        }
        //check to ensure credit card ans security code are viable and that addresses
        //have been filled in
        if(creditNumber.length == 16 && securityCode.length == 3 && address.length > 0 
            && billingAddress.length>0){
            //configure endpoint info
            let config = {method: 'get', url: '/order/' + sessionStorage.getItem("logged_in") + "-" +  amount.toString() + "-"
            + address + "-" + billingAddress}
            //call api 
            axios(config)
            .then(function (response) {
                orderNum = response.data.result; 
                i = 0; 
                //for each order added, add an order_book item to track which books 
                //are in which orders
                for(i; i < bookArray.length; i++){
                    let config = {method: 'get', url: '/orderbook/' + orderNum + "-" + bookArray[i].isbn}
                    
                    axios(config)
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        console.log("error", error);
                    }); 
                }
                //now, one more call to the server to update the copies for the book
                //just ordered
                let config = {method: 'get', url: '/updatecopies/' + orderNum}
                        axios(config)
                        .then(function (response) {
                            orderNum = (response.data.result); 
                        })
                        .catch(function (error) {
                            console.log("error", error);
                        }); 
            })
            .catch(function (error) {
                console.log("error", error);
            });    
            //set the snackbar open state to true after completion
            setSnackbarOpen(true)
        }
        else{
            alert("Invalid Address or Credit Card information. Credit card number must be 16 digits, security code must be 3.")
        }
    }
    //funciton to set snackbar state to closed when it is closed
    function handleSnackbarClose(){
        setSnackbarOpen(false)
    }

    //functions to track the current content of TextFields
    function handleAddressChange(TextField){
        setAddress(TextField.target.value)
    }
    function handleBillingAddressChange(TextField){
        setBillingAddress(TextField.target.value)
    }
    function handleSecurityCodeChange(TextField){
        setSecurityCode(TextField.target.value)
    }
    function handleCreditNumberChange(TextField){
        setCreditNumber(TextField.target.value)
    }

    if(bookArray){
        console.log(bookArray.length)
       
        if(bookArray.length > 0){
            cartResults = bookArray.map(result => {
                return(
                    <Grid style={{marginTop: 10}} item xs={12}>
                        <Card>
                            <Grid container justifyContent="space-evenly" style={{paddingRight: 5, marginRight: 2}}>
                                <Grid item style={{marginTop: 5, marginLeft: 20}}> 
                                    <MenuBookIcon  htmlColor='brown' style={{fontSize: 50}}  />
                                </Grid>
                                <Grid item style={{marginTop: 15, marginLeft: 20}}>
                                    <Typography variant="h7">Title: {result.book_name}</Typography>
                                </Grid>
                                <Grid item style={{marginTop: 15, marginLeft: 20}}>
                                    <Typography variant="h7">Author: {result.author}</Typography>
                                </Grid>
                                <Grid item style={{marginTop: 5, marginLeft: 20}}>
                                    <Grid container direction='column'>
                                        <Grid item>
                                            <Typography variant="h7">Genre: {result.genre}</Typography>
                                        </Grid>
                                        <Grid item>
                                             <Typography variant="h7">Pages: {result.num_of_pages}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction='column' style={{marginTop: 5, marginLeft: 20}}>
                                        <Grid item>
                                            <Typography variant="h7">Copies: {result.num_of_copies}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h7">Price: ${result.price}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    )
                })
            }
        }

    return(
        <>
        {
            sessionStorage.getItem("logged_in") ?
            <>
                <Grid container spacing={2} justifyContent="flex-end" style={{paddingRight: 30}}>
                     <Grid item>
                        <Button href="/orders" style={{minWidth: 150, minHeight: 50}} variant="contained">Orders</Button>
                    </Grid>
                    <Grid item>
                        <Button href="/customer" style={{minWidth: 150, minHeight: 50}} variant="contained">Back to Shop</Button>
                    </Grid>
                </Grid>
                <Typography style={{color: "white", fontFamily: 'Georgia, serif'}}variant="h4">{sessionStorage.getItem("logged_in")}'s Cart </Typography>
                <Grid container justifyContent='center' direction="row" rowSpacing={3}>
                    <Grid item xs={8}>
                        { cartResults ? 
                        <Grid container>
                        {cartResults}
                        </Grid>: <>No items yet</>
                        }
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" style={{paddingTop: 10}}>
                    <Grid item xs={8} style={{marginBottom: 20}}>
                        <Accordion>
                            <AccordionSummary style={{backgroundColor: "#8ca7bd"}}expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Payment and Order Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{backgroundColor: "#9dbbd4"}}>
                                <Grid container justifyContent="center" rowSpacing={3} style={{marginTop: 20}}>
                                    <Grid item xs={6}>
                                        <TextField 
                                            label="Address"
                                            onChange={handleAddressChange}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            onChange={handleCreditNumberChange} 
                                            label="Credit Card Number"/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            onChange={handleBillingAddressChange}
                                            label="Billing Address"/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            onChange={handleSecurityCodeChange} 
                                            label="Security Code"/>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center" style={{paddingRight: 30}}>
                                    <Grid item>
                                        <Button style={{minWidth: 150, minHeight: 50, marginTop: 50}}
                                         variant="contained"
                                         onClick={handleOrder}>Order</Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </ Grid>
                <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Ordered!"
                />
            </>
            :<>Not Logged In</>
        }
        </>
    )
}
export default Cart