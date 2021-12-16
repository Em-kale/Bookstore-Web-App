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

function Cart(){
    let axios = require('axios')
    const[bookArray, setBookArray] = useState([])
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
                <Grid container justifyContent="flex-end" style={{paddingRight: 30}}>
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
                    <Grid item xs={8}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>Payment and Order Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container justifyContent="center" style={{paddingRight: 30}}>
                                    <Grid item>
                                        <Button style={{minWidth: 150, minHeight: 50, marginTop: 50}} variant="contained">Order</Button>
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