import React from 'react'

//materiial UI imprts
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from '@mui/material/Link'

function Header(){
    return(
        <Link underline="none" href="/">
        <Grid 
        container
        style={{
        backgroundColor: '#333454',
        marginLeft: 0
        }}
        alignItems = 'center'
        justifyContent = 'flex-start'
        spacing={3}
        >
            <Grid item>
              
                <MenuBookIcon htmlColor='white'style={{fontSize: 50}} />
                
            </Grid>
            <Grid item>
                <Typography variant='h3'
                style= {{
                    color: 'white',
                    fontFamily: 'Georgia, serif'
                }}
                >
                    Look Inna Book
                </Typography>
            </Grid>
        </Grid>
        </Link>
    )
}
export default Header; 