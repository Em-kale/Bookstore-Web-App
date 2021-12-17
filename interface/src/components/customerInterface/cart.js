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

function Cart(){
    let axios = require('axios')
    const[bookArray, setBookArray] = useState([])
    const[address, setAddress]= useState("")
    const[billingAddress, setBillingAddress] = useState("")
    const[creditNumber, setCreditNumber] = useState("")
    const[securityCode, setSecurityCode] = useState("")

    let cartResults; 

    useEffect(()=>{
        let config = {method: 'get', url: '/cart/' + sessionStorage.getItem("logged_in")}

            axios(config)
            .then(function (response) {
                setBookArray(response.data.result); 
                }
            )
            .catch(function (error) {
                console.log("error", error);
            });
            
            console.log("array", bookArray)
        
    }, []);
    function handleOrder(){
        let i = 0
        let amount = 0; 
        let orderNum; 
        //calculate amount minus the percent take for the publisher
        for(i; i < bookArray.length; i++){
            amount += (bookArray[i].price - bookArray[i].price * (bookArray[i].percent_take)/100)
        }
        
        if(creditNumber.length == 16 && securityCode.length == 3 && address.length > 0 
            && billingAddress.length>0){
            let config = {method: 'get', url: '/order/' + sessionStorage.getItem("logged_in") + "." +  amount + "."
            + address + "." + billingAddress}

            axios(config)
            .then(function (response) {
                orderNum = response.data.result; 
                console.log("RESPONSE", response.data);
                i = 0; 
                for(i; i < bookArray.length; i++){
                    let config = {method: 'get', url: '/orderbook/' + orderNum + "." + bookArray[i].isbn}
                   
                    axios(config)
                    .then(function (response) {
                    })
                    .catch(function (error) {
                        console.log("error", error);
                    }); 
                }
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
            
            
        }
        else{
            alert("Invalid Address or Credit Card information. Credit card number must be 16 digits, security code must be 3.")
        }

         //calculate amount minus the percent take for the publisher
       
        //reduce number of copies for all books in cart by one
        //sum the prices of all 
        //add this order to order
        //add order number on backend
        //get order number 
        //create order book item for each isbn
    }
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
            </>
            :<>Not Logged In</>
        }
        </>
    )
}
export default Cart