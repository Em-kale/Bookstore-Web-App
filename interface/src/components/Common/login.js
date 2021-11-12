import React from 'react'

//material ui imports
//material ui imports
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { Typography } from '@mui/material'
import Link from '@mui/material/Link'

const useStyles = makeStyles((theme) => ({
    textField:  {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
         },
        "& .MuiInputLabel-outlined": {
            color: "white"
        },
    },
}));


function Login(props){

    const classes = useStyles()

    const{
        loginType
    } = props 
    
    function handleSubmit(){
        if(loginType == 'staff'){
            document.location.href = '/staff'
        }
        else if(loginType == 'customer'){
            document.location.href = '/customer'
        }
    }

    let linkURL = '/register-' + `${loginType}`
    return(
        <Grid style={{marginTop: 20}} container direction='column' spacing={5}>
            <Grid item>
                <TextField 
                className={classes.textField}
                label = "username"
                />
            </Grid>
            <Grid item>
                <TextField 
                className={classes.textField}
                label = "password"
                />
            </Grid>
            <Grid item style={{marginTop: 5}}>
                <Button onClick={handleSubmit} variant='contained'>Submit</Button>
            </Grid>
            <Grid item>
                <Link underline='hover' color='#7dabf5' href={linkURL}>
                    <Typography color='#7dabf5'>
                    Register {loginType}
                    </Typography>
                </Link>
            </Grid>
        </Grid>
    )
}

export default Login