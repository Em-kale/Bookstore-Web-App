import React from 'react'

//material ui imports for consistent front end elements
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'


const useStyles = makeStyles((theme) => ({
    textField:  {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
         },
        "& .MuiInputLabel-outlined": {
            color: "white"
        },
    },
    input: {
      color: "white",
    },
}));

function CustomerInterface(){
    const classes = useStyles(); 

    return (
    <>
        <Grid container 
            style={{
                marginLeft: 0,
                marginTop: 40
                }}
                alignItems = 'center'
                justifyContent = 'center'
                spacing={2}
                
            >
            <Grid item>
                <TextField 
                    label='Search'
                    style={{
                        marginLeft: 0,
                        width: 500
                    }}
                    className = {classes.textField}
                    inputProps={{className: classes.input }}
                    defaultValue='Lord of The Rings'
                   // variant="outlined" 
                />
            </Grid>
            <Grid item style={{
                        marginLeft: 0,
                    }}>
                <Button style={{
                        marginLeft: 0,
                    }}
                    variant="contained"
                    >Search</Button>
            </Grid>
        </Grid>
    </>
        )
}
export default CustomerInterface 
