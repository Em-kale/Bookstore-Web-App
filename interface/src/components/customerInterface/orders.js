import React, {useEffect, useState} from 'react'

//material ui imports 
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import { AccordionSummary } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import { AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
function Orders(){
    const [orders, setOrders] = useState([])

    useEffect(()=>{
        let axios = require('axios')
        let config = {method: 'get', url: '/getorders/' + sessionStorage.getItem("logged_in")}
        let orders; 
        axios(config)
        .then(function (response) {
            //array of orders
            orders = response.data.result; 
            setOrders(orders)
            //for each order in that array. get array of book
        }
        )
        .catch(function (error) {
            console.log("error", error);
        });
    }, [])
    let individualOrder
    let orderDisplay=orders.map((orderArray)=>{
        individualOrder = orderArray.map((order)=>{
            return (
            <Grid item xs={6}>
                
                        <Typography display="block" variant="h7">Book: {order.book_name}</Typography>
                        <Typography  display="block" variant="h7">Author: {order.author}</Typography>
                        <Typography  display="block" variant="h7">Publisher: {order.publisher_name}</Typography>
                        <Typography  display="block" variant="h7">Pages: {order.num_of_pages}</Typography>
                        <Typography  display="block" variant="h7">Copies: {order.copies}</Typography>
                        <Typography  display="block" variant="h7">Price: {order.price}</Typography>
                    
            </Grid>
            )
        })
        return(
            <Grid item xs={8} style={{marginBottom: 2}}>
            <Accordion>
                <AccordionSummary style={{backgroundColor: "#8ca7bd"}}expandIcon={<ExpandMoreIcon/>}>
                    Order {orderArray[0].order_num}
                </AccordionSummary>
                <AccordionDetails style={{backgroundColor: "#9dbbd4"}}>
                    <Grid container rowSpacing={3} justifyContent="center">
                            <Grid item xs={12}>
                            <Typography variant="h6" display="block">Shipping Address: {orderArray[0].shipping_address}</Typography>
                            <Typography variant="h6" display="block">Billing Address: {orderArray[0].billing_address}</Typography>
                            <Typography variant="h6" display="block"> Current Location: {orderArray[0].current_location}</Typography>
                        </Grid>
                        {individualOrder}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            </Grid>
        )
    })
    return(
        <>
        {
            sessionStorage.getItem("logged_in") ?
            <>
            
                <Grid container spacing={2} justifyContent="flex-end" style={{paddingRight: 30}}>
                     <Grid item>
                        <Button href="/cart" style={{minWidth: 150, minHeight: 50}} variant="contained">Cart</Button>
                    </Grid>
                    <Grid item>
                        <Button href="/customer" style={{minWidth: 150, minHeight: 50}} variant="contained">Back to Shop</Button>
                    </Grid>
                </Grid>
                <Typography variant="h3" style={{color: 'white', fontFamily: 'georgia-serif'}}>{sessionStorage.getItem("logged_in")}'s orders</Typography>
                <Grid container justifyContent="center" spacing={2}>
                    {orderDisplay}
                </Grid>
            </>
            :<Typography>Not Logged In</Typography>
        }
        </>
        
    )
}
export default Orders