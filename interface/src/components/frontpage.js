import React from 'react'

//material ui imports for consistent front end elements
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

function FrontPage(){
    return(
        <div style={{display: 'table', width: '100%', height: '100%', margin: 0,}}>
            <Grid
            container 
            alignItems='center'
            justifyContent='center'
            spacing={10}
            >
                <Grid item xs={12} style={{marginTop: 100, marginBottom: 0}}> 
                    <Typography
                     style= {{
                        color: 'white',
                        fontFamily: 'Georgia, serif'
                        }}> 
                        Hello, welcome to Look Inna Book!<br />Are you a customer or staff?
                     </Typography>
                </Grid >
                <Grid item style={{marginTop: 0}}> 
                    <Button variant="contained" href="/customer-login">Customer</Button>
                </Grid >
                <Grid item>
                    <Button variant="contained" href="/staff-login">Staff</Button>
                </Grid>
            </Grid>
        </div>
    )
}
export default FrontPage