import React from 'react'

//material ui imports for consistent front end elements
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material'

function FrontPage(){
    return(
        <Grid item>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography>Welcome to Emmitt's Book Shop</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Button href="/customer">Customer</Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Button href="/staff">Staff</Button>
            </Grid>
        </Grid>
    )
}
export default FrontPage